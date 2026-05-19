// Convert national-level vote shares into a per-district vote breakdown
// suitable for the seat-allocation algorithm.
//
// This is an *approximation*, surfaced in the UI as such. The party rank-and-
// file maths is exact (Hare quota + reinforced PR) - only the upstream split
// of national votes into the six constituencies is an estimate, because the
// user gives us a single national number per party.
//
// Method:
//   1. For each party with a 2021 baseline, compute a per-district intensity:
//        intensity = (party's share of its national 2021 vote in that district)
//                    ÷ (district's share of national registered voters in 2026)
//      A coefficient of 1 means the party's local strength matched its share
//      of the electorate; >1 means over-performance in that district.
//   2. New parties without a 2021 baseline default to uniform intensity (1).
//   3. Simulated district votes for a party =
//        currentNationalShare × districtRegisteredVoters × estTurnout × intensity.
//   4. The algorithm tolerates districts whose summed shares differ slightly
//      from the national share - the Hare quota is computed from each
//      district's actual valid votes, just as in the real election.
//   5. Rounded to integers; negative or NaN values clamp to 0.

import { DISTRICTS } from '../data/districts';
import { RESULTS_2021 } from '../data/results-2021';
import type {
  DistrictId,
  DistrictVoteBreakdown,
  PartyId
} from '../data/types';

const DISTRICT_IDS: DistrictId[] = ['NIC', 'LIM', 'FAM', 'LAR', 'PAF', 'KYR'];

// District -> 2026 registered voters.
const REGISTERED_BY_DISTRICT: Record<DistrictId, number> = DISTRICTS.reduce(
  (acc, d) => {
    acc[d.id] = d.registeredVoters2026;
    return acc;
  },
  {} as Record<DistrictId, number>
);

const TOTAL_REGISTERED: number = DISTRICT_IDS.reduce(
  (a, d) => a + REGISTERED_BY_DISTRICT[d],
  0
);

// District -> 2021 total seats (used as a denominator when we have to
// infer a party's strength in a district from its seat count alone).
const SEATS_2021_BY_DISTRICT: Record<DistrictId, number> = DISTRICTS.reduce(
  (acc, d) => {
    acc[d.id] = d.seats2021;
    return acc;
  },
  {} as Record<DistrictId, number>
);

// Pre-compute intensity coefficients per (party, district).
//
// Where RESULTS_2021 has actual district vote counts, intensity is exact:
//   intensity = (districtVotes / nationalVotes) ÷ (districtRegistered / totalRegistered)
//
// For districts where only seat counts are known (LIM / FAM / LAR for several
// parties), we estimate the party's local strength as
//   local_share_estimate = (seats_won_in_district / district_total_seats) /
//                          (party_national_share)
// using the rule of thumb that a party that wins, say, 25 % of a district's
// seats is approximately as strong locally as a party that took 25 % of that
// district's votes. We then back out implied vote counts so the party's
// national total is preserved, and compute intensity the same way as for
// known districts. This is documented in the UI as an approximation.
function buildIntensityMap(): Map<PartyId, Partial<Record<DistrictId, number>>> {
  const out = new Map<PartyId, Partial<Record<DistrictId, number>>>();

  for (const entry of RESULTS_2021) {
    if (!entry.nationalVotes || entry.nationalVotes <= 0) continue;
    const nationalShare = entry.nationalVotes / DISTRICTS.reduce(
      (a, d) => a + d.registeredVoters2026,
      0
    );
    // We deliberately use 2026 registered voters as the denominator here so
    // intensities stay consistent across the simulator's pipeline (which also
    // uses 2026 registered voters when applying intensities forward).
    void nationalShare;

    // Pass 1: pick out districts with known vote counts.
    const knownDistricts: DistrictId[] = [];
    const unknownDistricts: DistrictId[] = [];
    let knownVotesSum = 0;
    for (const did of DISTRICT_IDS) {
      const data = entry.perDistrict[did];
      if (data && typeof data.votes === 'number' && data.votes > 0) {
        knownDistricts.push(did);
        knownVotesSum += data.votes;
      } else {
        unknownDistricts.push(did);
      }
    }

    // Pass 2: estimate party strength in each unknown district from
    // (party_seats_in_district / district_total_seats). Higher → stronger.
    // Fall back to the district's share of registered voters if no seat
    // information is available either.
    const residualVotes = Math.max(0, entry.nationalVotes - knownVotesSum);
    const districtVotesByDistrict: Partial<Record<DistrictId, number>> = {};
    for (const did of knownDistricts) {
      districtVotesByDistrict[did] = entry.perDistrict[did]!.votes;
    }
    if (unknownDistricts.length > 0 && residualVotes > 0) {
      // Compute a relative weight per unknown district.
      const weights: Partial<Record<DistrictId, number>> = {};
      let weightSum = 0;
      for (const did of unknownDistricts) {
        const data = entry.perDistrict[did];
        const seatsWon = data?.seats ?? 0;
        const districtSeats = SEATS_2021_BY_DISTRICT[did];
        const popWeight = REGISTERED_BY_DISTRICT[did];
        let w: number;
        if (seatsWon > 0 && districtSeats > 0) {
          // Blend seat-share signal (multiplied by population) with a
          // pure-population baseline. The blend dampens swings introduced by
          // small-N seat counts in tiny districts.
          const seatShare = seatsWon / districtSeats;
          w = popWeight * (0.1 + 1.8 * seatShare);
        } else if (seatsWon === 0 && districtSeats > 0) {
          // The party fielded but won no seat - assume below-average local
          // strength.
          w = popWeight * 0.4;
        } else {
          w = popWeight;
        }
        weights[did] = w;
        weightSum += w;
      }
      if (weightSum > 0) {
        for (const did of unknownDistricts) {
          districtVotesByDistrict[did] =
            residualVotes * ((weights[did] ?? 0) / weightSum);
        }
      }
    }

    // Pass 3: intensity = districtPartyShareOfNational / districtPopulationShare.
    const perDistrict: Partial<Record<DistrictId, number>> = {};
    let anyAssigned = false;
    for (const did of DISTRICT_IDS) {
      const v = districtVotesByDistrict[did];
      if (typeof v === 'number' && v > 0) {
        const districtPartyShareOfNational = v / entry.nationalVotes;
        const districtPopulationShare =
          REGISTERED_BY_DISTRICT[did] / TOTAL_REGISTERED;
        if (districtPopulationShare > 0) {
          perDistrict[did] =
            districtPartyShareOfNational / districtPopulationShare;
          anyAssigned = true;
        }
      }
    }
    if (anyAssigned) out.set(entry.partyId, perDistrict);
  }
  return out;
}

const INTENSITY_BY_PARTY = buildIntensityMap();

/**
 * Compute the simulated district-level vote breakdown from national shares.
 *
 * @param nationalShares - per-party national vote share, in percent (0–100).
 *                         Missing parties are treated as 0.
 * @param estTurnout     - estimated nationwide turnout, in the range 0..1.
 */
export function deriveDistrictVotes(
  nationalShares: Partial<Record<PartyId, number>>,
  estTurnout: number
): DistrictVoteBreakdown {
  const turnout = Math.max(0, Math.min(1, estTurnout));

  const breakdown: DistrictVoteBreakdown = {
    NIC: {},
    LIM: {},
    FAM: {},
    LAR: {},
    PAF: {},
    KYR: {}
  };

  for (const [pidRaw, sharePctRaw] of Object.entries(nationalShares)) {
    const pid = pidRaw as PartyId;
    const sharePct = sharePctRaw ?? 0;
    if (sharePct <= 0) continue;
    const share = sharePct / 100;
    const intensityMap = INTENSITY_BY_PARTY.get(pid);

    for (const districtId of DISTRICT_IDS) {
      const registered = REGISTERED_BY_DISTRICT[districtId];
      const intensity =
        intensityMap && typeof intensityMap[districtId] === 'number'
          ? (intensityMap[districtId] as number)
          : 1;
      // Core formula. Negative inputs would never happen because `share`
      // and `turnout` are clamped non-negative, but guard anyway.
      const raw = share * registered * turnout * intensity;
      const votes = Number.isFinite(raw) && raw > 0 ? Math.round(raw) : 0;
      if (votes > 0) {
        breakdown[districtId][pid] = votes;
      }
    }
  }

  return breakdown;
}
