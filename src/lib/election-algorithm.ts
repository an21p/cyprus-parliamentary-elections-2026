// Cyprus 3-stage parliamentary seat allocation ("reinforced proportional representation").
//
// Reference: research/compass_artifact_wf-...md §1.6–§1.7. The implementation here is a
// pure, deterministic translation of that spec. No data is hardcoded — district seat
// counts and thresholds are inputs so the same routine works for 2021 (Nicosia 20, Paphos 4)
// and 2026 (Nicosia 19, Paphos 5).

import type {
  AllocationInput,
  AllocationResult,
  DistrictId,
  FirstDistributionDistrictTrace,
  PartyId,
  SecondDistributionTrace,
  ThirdDistributionTrace,
  ThresholdSet
} from './data/types';

const DISTRICT_IDS: DistrictId[] = ['NIC', 'LIM', 'FAM', 'LAR', 'PAF', 'KYR'];

interface PartyDistrictUnused {
  districtId: DistrictId;
  unusedVotes: number;
}

export function allocateSeats(
  input: AllocationInput,
  districtSeats: Record<DistrictId, number>,
  thresholds: ThresholdSet
): AllocationResult {
  // ---- Collect the full party universe across all districts ----
  const partyVoteByDistrict = new Map<DistrictId, Map<PartyId, number>>();
  const allPartyIds = new Set<PartyId>();
  for (const districtId of DISTRICT_IDS) {
    const breakdown = input.districtBreakdown[districtId] ?? {};
    const partyMap = new Map<PartyId, number>();
    for (const [pid, votes] of Object.entries(breakdown) as [PartyId, number | undefined][]) {
      if (typeof votes === 'number' && votes > 0) {
        partyMap.set(pid, votes);
        allPartyIds.add(pid);
      }
    }
    partyVoteByDistrict.set(districtId, partyMap);
  }

  // ---- First distribution: district-level Hare quota with truncation (§1.6) ----
  const firstDistribution: FirstDistributionDistrictTrace[] = [];
  // seats won per (district, party) at each stage:
  const seatsByDistrictParty = new Map<DistrictId, Map<PartyId, number>>();
  // unused votes per (district, party) carried into the national pool:
  const unusedByDistrictParty = new Map<DistrictId, Map<PartyId, number>>();
  // seats remaining per district after stage 1 (national-pool capacity):
  const seatsRemainingByDistrict = new Map<DistrictId, number>();
  let totalValidVotes = 0;

  for (const districtId of DISTRICT_IDS) {
    const totalSeats = districtSeats[districtId];
    const partyMap = partyVoteByDistrict.get(districtId) ?? new Map<PartyId, number>();
    const validVotes = Array.from(partyMap.values()).reduce((a, b) => a + b, 0);
    totalValidVotes += validVotes;
    const quota = totalSeats > 0 ? Math.floor(validVotes / totalSeats) : 0;

    const perParty: FirstDistributionDistrictTrace['perParty'] = [];
    const districtSeatMap = new Map<PartyId, number>();
    const districtUnusedMap = new Map<PartyId, number>();
    let seatsAllocated = 0;
    for (const [pid, votes] of partyMap.entries()) {
      const seatsWon = quota > 0 ? Math.floor(votes / quota) : 0;
      const unusedVotes = votes - seatsWon * quota;
      perParty.push({ partyId: pid, votes, seatsWon, unusedVotes });
      districtSeatMap.set(pid, seatsWon);
      districtUnusedMap.set(pid, unusedVotes);
      seatsAllocated += seatsWon;
    }
    // Stable sort by votes desc so the trace is readable in the UI.
    perParty.sort((a, b) => b.votes - a.votes);

    seatsByDistrictParty.set(districtId, districtSeatMap);
    unusedByDistrictParty.set(districtId, districtUnusedMap);
    seatsRemainingByDistrict.set(districtId, totalSeats - seatsAllocated);

    firstDistribution.push({
      districtId,
      totalSeats,
      validVotes,
      quota,
      perParty,
      seatsAllocated,
      seatsRemaining: totalSeats - seatsAllocated
    });
  }

  const totalSeats = DISTRICT_IDS.reduce((a, d) => a + districtSeats[d], 0);
  const stage1Total = firstDistribution.reduce((a, t) => a + t.seatsAllocated, 0);

  // ---- National aggregates ----
  const nationalVotesByParty = new Map<PartyId, number>();
  const nationalUnusedByParty = new Map<PartyId, number>();
  for (const pid of allPartyIds) {
    let votes = 0;
    let unused = 0;
    for (const districtId of DISTRICT_IDS) {
      votes += partyVoteByDistrict.get(districtId)?.get(pid) ?? 0;
      unused += unusedByDistrictParty.get(districtId)?.get(pid) ?? 0;
    }
    nationalVotesByParty.set(pid, votes);
    nationalUnusedByParty.set(pid, unused);
  }

  // ---- Second distribution: national pool, 3.6 % single-party threshold (§1.6) ----
  // Threshold is expressed as a percentage in ThresholdSet (e.g. 3.6 for 3.6 %).
  const secondThresholdShare = thresholds.singleParty / 100;
  const residualThresholdShare = thresholds.residual / 100;

  const qualifyingSecond: PartyId[] = [];
  const excludedBelowThreshold: SecondDistributionTrace['excludedBelowThreshold'] = [];
  for (const pid of allPartyIds) {
    const votes = nationalVotesByParty.get(pid) ?? 0;
    const share = totalValidVotes > 0 ? votes / totalValidVotes : 0;
    if (share >= secondThresholdShare) {
      qualifyingSecond.push(pid);
    } else {
      excludedBelowThreshold.push({ partyId: pid, nationalShare: share * 100 });
    }
  }

  const seatsRemainingAfterStage1 = totalSeats - stage1Total;
  const totalQualifyingUnused = qualifyingSecond.reduce(
    (a, pid) => a + (nationalUnusedByParty.get(pid) ?? 0),
    0
  );
  const secondStageQuota =
    seatsRemainingAfterStage1 > 0
      ? Math.floor(totalQualifyingUnused / seatsRemainingAfterStage1)
      : 0;

  const secondPerParty: SecondDistributionTrace['perParty'] = [];
  const stage2SeatsByParty = new Map<PartyId, number>();
  let stage2SeatsAllocated = 0;
  for (const pid of qualifyingSecond) {
    const unused = nationalUnusedByParty.get(pid) ?? 0;
    const seatsWon = secondStageQuota > 0 ? Math.floor(unused / secondStageQuota) : 0;
    secondPerParty.push({ partyId: pid, unusedVotes: unused, seatsWon });
    stage2SeatsByParty.set(pid, seatsWon);
    stage2SeatsAllocated += seatsWon;
  }
  secondPerParty.sort((a, b) => b.unusedVotes - a.unusedVotes);

  const secondDistribution: SecondDistributionTrace = {
    qualifyingParties: [...qualifyingSecond].sort(
      (a, b) => (nationalVotesByParty.get(b) ?? 0) - (nationalVotesByParty.get(a) ?? 0)
    ),
    excludedBelowThreshold,
    totalUnusedVotes: totalQualifyingUnused,
    seatsRemaining: seatsRemainingAfterStage1,
    quota: secondStageQuota,
    perParty: secondPerParty,
    seatsAllocated: stage2SeatsAllocated
  };

  // ---- Third distribution: residual seats, 7.2 % threshold (§1.6) ----
  // Awarded one-by-one to qualifying parties ranked by remaining unused votes
  // (national unused, minus the votes "consumed" by stage-2 quota allocations).
  const seatsRemainingAfterStage2 = seatsRemainingAfterStage1 - stage2SeatsAllocated;
  const qualifyingThird: PartyId[] = [];
  for (const pid of allPartyIds) {
    const share =
      totalValidVotes > 0 ? (nationalVotesByParty.get(pid) ?? 0) / totalValidVotes : 0;
    if (share >= residualThresholdShare) qualifyingThird.push(pid);
  }

  const remainingByParty = new Map<PartyId, number>();
  for (const pid of qualifyingThird) {
    const unused = nationalUnusedByParty.get(pid) ?? 0;
    const consumed = (stage2SeatsByParty.get(pid) ?? 0) * secondStageQuota;
    remainingByParty.set(pid, unused - consumed);
  }

  const stage3SeatsByParty = new Map<PartyId, number>();
  let stage3SeatsAllocated = 0;
  for (let i = 0; i < seatsRemainingAfterStage2; i++) {
    // Pick qualifying party with largest remaining unused votes. Tie-break by
    // total national votes (descending) for determinism — a defensible reading
    // of "ranking the parties based on their total votes" (§1.6 quote).
    let bestPid: PartyId | null = null;
    let bestRemaining = -Infinity;
    let bestNational = -Infinity;
    for (const pid of qualifyingThird) {
      const remaining = remainingByParty.get(pid) ?? 0;
      const national = nationalVotesByParty.get(pid) ?? 0;
      if (
        remaining > bestRemaining ||
        (remaining === bestRemaining && national > bestNational)
      ) {
        bestRemaining = remaining;
        bestNational = national;
        bestPid = pid;
      }
    }
    if (bestPid === null) break;
    stage3SeatsByParty.set(bestPid, (stage3SeatsByParty.get(bestPid) ?? 0) + 1);
    // Each residual seat conceptually "consumes" one quota of unused votes;
    // this keeps subsequent picks honest if more than one seat goes to the same party.
    remainingByParty.set(bestPid, bestRemaining - secondStageQuota);
    stage3SeatsAllocated++;
  }

  const thirdPerParty: ThirdDistributionTrace['perParty'] = qualifyingThird
    .map((pid) => ({
      partyId: pid,
      remainingUnusedVotes:
        (nationalUnusedByParty.get(pid) ?? 0) -
        (stage2SeatsByParty.get(pid) ?? 0) * secondStageQuota,
      seatsWon: stage3SeatsByParty.get(pid) ?? 0
    }))
    .sort((a, b) => b.remainingUnusedVotes - a.remainingUnusedVotes);

  const thirdDistribution: ThirdDistributionTrace = {
    qualifyingParties: [...qualifyingThird].sort(
      (a, b) => (nationalVotesByParty.get(b) ?? 0) - (nationalVotesByParty.get(a) ?? 0)
    ),
    seatsRemaining: seatsRemainingAfterStage2,
    perParty: thirdPerParty,
    seatsAllocated: stage3SeatsAllocated
  };

  // ---- Reassign stage 2+3 seats back to districts (§1.6 quote) ----
  // "Seats allocated in the second and third allocation are distributed to lists
  // in constituencies by ranking the parties based on their total votes and
  // giving the lists a seat in the constituency where it had the most unused
  // votes in the first allocation, assuming that constituency did not have all
  // its seats filled previously."
  //
  // Implementation: process parties in descending national-vote order. For each
  // party, repeatedly place one seat into its highest-unused-votes district that
  // still has capacity, decrementing capacity each time.
  const partyOrder: PartyId[] = Array.from(allPartyIds).sort(
    (a, b) => (nationalVotesByParty.get(b) ?? 0) - (nationalVotesByParty.get(a) ?? 0)
  );

  for (const pid of partyOrder) {
    const nationalSeats =
      (stage2SeatsByParty.get(pid) ?? 0) + (stage3SeatsByParty.get(pid) ?? 0);
    if (nationalSeats === 0) continue;

    // (district, unused) snapshot for this party, descending by unused votes.
    const ranked: PartyDistrictUnused[] = DISTRICT_IDS.map((did) => ({
      districtId: did,
      unusedVotes: unusedByDistrictParty.get(did)?.get(pid) ?? 0
    })).sort((a, b) => b.unusedVotes - a.unusedVotes);

    let toPlace = nationalSeats;
    for (const { districtId } of ranked) {
      if (toPlace === 0) break;
      const cap = seatsRemainingByDistrict.get(districtId) ?? 0;
      if (cap <= 0) continue;
      const seatMap =
        seatsByDistrictParty.get(districtId) ?? new Map<PartyId, number>();
      seatMap.set(pid, (seatMap.get(pid) ?? 0) + 1);
      seatsByDistrictParty.set(districtId, seatMap);
      seatsRemainingByDistrict.set(districtId, cap - 1);
      toPlace--;
    }
    // If toPlace > 0 here, all preferred districts are full — fall back to any
    // district with remaining capacity, still preferring those with higher unused.
    // (In well-formed Cypriot inputs this branch is not exercised, but it keeps
    // the algorithm total rather than throwing on pathological inputs.)
    if (toPlace > 0) {
      for (const districtId of DISTRICT_IDS) {
        while (toPlace > 0 && (seatsRemainingByDistrict.get(districtId) ?? 0) > 0) {
          const seatMap =
            seatsByDistrictParty.get(districtId) ?? new Map<PartyId, number>();
          seatMap.set(pid, (seatMap.get(pid) ?? 0) + 1);
          seatsByDistrictParty.set(districtId, seatMap);
          seatsRemainingByDistrict.set(
            districtId,
            (seatsRemainingByDistrict.get(districtId) ?? 0) - 1
          );
          toPlace--;
        }
      }
    }
  }

  // ---- Roll up final per-party / per-district totals ----
  const perPartyTotals = new Map<PartyId, number>();
  for (const districtId of DISTRICT_IDS) {
    const m = seatsByDistrictParty.get(districtId) ?? new Map<PartyId, number>();
    for (const [pid, seats] of m.entries()) {
      perPartyTotals.set(pid, (perPartyTotals.get(pid) ?? 0) + seats);
    }
  }

  const perParty = Array.from(perPartyTotals.entries())
    .map(([partyId, seats]) => ({ partyId, seats }))
    .filter((x) => x.seats > 0)
    .sort((a, b) => b.seats - a.seats);

  const perDistrict = DISTRICT_IDS.map((districtId) => {
    const m = seatsByDistrictParty.get(districtId) ?? new Map<PartyId, number>();
    return {
      districtId,
      perParty: Array.from(m.entries())
        .map(([partyId, seats]) => ({ partyId, seats }))
        .filter((x) => x.seats > 0)
        .sort((a, b) => b.seats - a.seats)
    };
  });

  return {
    perParty,
    perDistrict,
    firstDistribution,
    secondDistribution,
    thirdDistribution,
    totalSeats,
    totalValidVotes
  };
}
