// Tests for the Cyprus 3-stage seat allocation algorithm.
//
// Data drawn from research/compass_artifact_wf-...md §1.7 (worked 2021 examples)
// and §2.3 (national 2021 baseline). Per the task brief these are inline
// fixtures - we do NOT import from data/results-2021.ts, which is being built
// by a parallel subagent.

import { describe, expect, it } from 'vitest';
import { allocateSeats } from '../src/lib/election-algorithm';
import type {
  AllocationInput,
  DistrictId,
  PartyId,
  ThresholdSet
} from '../src/lib/data/types';

// 2021 thresholds (the only set used by the worked examples).
const THRESHOLDS_2021: ThresholdSet = {
  singleParty: 3.6,
  twoPartyCoalition: 10,
  largeCoalition: 20,
  residual: 7.2
};

const SEATS_2021: Record<DistrictId, number> = {
  NIC: 20,
  LIM: 12,
  FAM: 11,
  LAR: 6,
  PAF: 4,
  KYR: 3
};

// ---------- Helpers ----------

function emptyDistrictBreakdown(): AllocationInput['districtBreakdown'] {
  return { NIC: {}, LIM: {}, FAM: {}, LAR: {}, PAF: {}, KYR: {} };
}

function seatsOf(
  result: ReturnType<typeof allocateSeats>,
  districtId: DistrictId,
  partyId: PartyId
): number {
  const dist = result.perDistrict.find((d) => d.districtId === districtId);
  return dist?.perParty.find((p) => p.partyId === partyId)?.seats ?? 0;
}

// ============================================================
// Quota math from §1.7
// ============================================================

describe('first-distribution quota math (Cyprus 2021)', () => {
  it('Nicosia 2021 quota = floor(122,347 / 20) = 6,117', () => {
    const input: AllocationInput = { districtBreakdown: emptyDistrictBreakdown() };
    input.districtBreakdown.NIC = {
      DISY: 31163,
      AKEL: 25770,
      DIKO: 13449,
      EDEK: 9061,
      KOSP: 8386,
      DIPA: 8232,
      ELAM: 7486,
      // 18,800 votes for sub-threshold lists, split so none clears the quota.
      KEKK: 6000,
      ALMA: 6000,
      ADK: 4000,
      VOLT: 2800
    };
    const result = allocateSeats(input, SEATS_2021, THRESHOLDS_2021);
    const nic = result.firstDistribution.find((d) => d.districtId === 'NIC');
    expect(nic).toBeDefined();
    expect(nic!.validVotes).toBe(122347);
    expect(nic!.quota).toBe(6117);
  });

  it('Kyrenia 2021 quota = floor(17,556 / 3) = 5,852, no party reaches quota', () => {
    const input: AllocationInput = { districtBreakdown: emptyDistrictBreakdown() };
    input.districtBreakdown.KYR = {
      AKEL: 4296,
      DISY: 4266,
      DIKO: 2634,
      DIPA: 1388,
      // Remainder 4,972 across smaller lists so total = 17,556.
      ELAM: 2000,
      EDEK: 1500,
      KOSP: 1000,
      KEKK: 472
    };
    const result = allocateSeats(input, SEATS_2021, THRESHOLDS_2021);
    const kyr = result.firstDistribution.find((d) => d.districtId === 'KYR');
    expect(kyr!.validVotes).toBe(17556);
    expect(kyr!.quota).toBe(5852);
    // No party reached quota; all 3 Kyrenia seats remain for national pool.
    expect(kyr!.seatsAllocated).toBe(0);
    expect(kyr!.seatsRemaining).toBe(3);
    for (const p of kyr!.perParty) {
      expect(p.seatsWon).toBe(0);
      expect(p.unusedVotes).toBe(p.votes);
    }
  });

  it('Paphos 2021 quota = floor(32,298 / 4) = 8,074; only DISY clears it (1 seat, unused 1,576)', () => {
    const input: AllocationInput = { districtBreakdown: emptyDistrictBreakdown() };
    input.districtBreakdown.PAF = {
      DISY: 9650,
      // Remainder 22,648 - assign to other listed parties such that none clear 8,074.
      AKEL: 7500,
      DIKO: 4500,
      EDEK: 4000,
      DIPA: 2000,
      ELAM: 1500,
      KOSP: 1500,
      KEKK: 1648
    };
    const result = allocateSeats(input, SEATS_2021, THRESHOLDS_2021);
    const paf = result.firstDistribution.find((d) => d.districtId === 'PAF');
    expect(paf!.validVotes).toBe(32298);
    expect(paf!.quota).toBe(8074);
    const disy = paf!.perParty.find((p) => p.partyId === 'DISY')!;
    expect(disy.seatsWon).toBe(1);
    expect(disy.unusedVotes).toBe(1576);
    expect(paf!.seatsAllocated).toBe(1);
    expect(paf!.seatsRemaining).toBe(3);
  });
});

// ============================================================
// Nicosia first-distribution seats + unused votes table (§1.7)
// ============================================================

describe('Nicosia 2021 first-distribution table (§1.7)', () => {
  const expected: Record<PartyId, { seats: number; unused: number } | undefined> = {
    DISY: { seats: 5, unused: 578 },
    AKEL: { seats: 4, unused: 1302 },
    DIKO: { seats: 2, unused: 1215 },
    EDEK: { seats: 1, unused: 2944 },
    KOSP: { seats: 1, unused: 2269 },
    DIPA: { seats: 1, unused: 2115 },
    ELAM: { seats: 1, unused: 1369 }
  } as Record<PartyId, { seats: number; unused: number } | undefined>;

  it('produces DISY 5 / AKEL 4 / DIKO 2 / EDEK 1 / KOSP 1 / DIPA 1 / ELAM 1 = 15 seats first round', () => {
    const input: AllocationInput = { districtBreakdown: emptyDistrictBreakdown() };
    input.districtBreakdown.NIC = {
      DISY: 31163,
      AKEL: 25770,
      DIKO: 13449,
      EDEK: 9061,
      KOSP: 8386,
      DIPA: 8232,
      ELAM: 7486,
      // 18,800 votes for sub-threshold lists. Split across four small lists so
      // that none individually clears the 6,117 quota (mirrors 2021 reality:
      // Generation Change, Solidarity, Hunters' Nicosia share, etc.).
      KEKK: 6000,
      ALMA: 6000,
      ADK: 4000,
      VOLT: 2800
    };
    const result = allocateSeats(input, SEATS_2021, THRESHOLDS_2021);
    const nic = result.firstDistribution.find((d) => d.districtId === 'NIC')!;
    expect(nic.validVotes).toBe(122347);
    expect(nic.quota).toBe(6117);

    for (const partyId of ['DISY', 'AKEL', 'DIKO', 'EDEK', 'KOSP', 'DIPA', 'ELAM'] as PartyId[]) {
      const row = nic.perParty.find((p) => p.partyId === partyId);
      expect(row, `missing row for ${partyId}`).toBeDefined();
      expect(row!.seatsWon, `${partyId} seats`).toBe(expected[partyId]!.seats);
      expect(row!.unusedVotes, `${partyId} unused`).toBe(expected[partyId]!.unused);
    }
    expect(nic.seatsAllocated).toBe(15);
    expect(nic.seatsRemaining).toBe(5);
  });
});

// ============================================================
// Threshold exclusion (3.6 % national)
// ============================================================

describe('second-distribution threshold (3.6 %)', () => {
  it('excludes Hunters/KEKK at 11,712 / 357,712 ≈ 3.27 %', () => {
    // Construct a synthetic national input whose totals match §2.3.
    // We only need the *national share* test to be accurate, so we lump all of
    // each party's national votes into a single arbitrary district (FAM) for
    // simplicity. This is fine because qualification is a function of national
    // share, not of which district the votes came from.
    const input: AllocationInput = { districtBreakdown: emptyDistrictBreakdown() };
    input.districtBreakdown.FAM = {
      DISY: 99328,
      AKEL: 79913,
      DIKO: 40395,
      ELAM: 24255,
      EDEK: 24022,
      DIPA: 21832,
      KOSP: 15762,
      KEKK: 11712,
      // Remainder of valid votes (Generation Change, Solidarity, etc., per §2.3):
      // 357,712 − (sum above) = 40,493.
      ALMA: 40493
    };
    const result = allocateSeats(input, SEATS_2021, THRESHOLDS_2021);
    expect(result.totalValidVotes).toBe(357712);

    // KEKK must NOT appear in qualifyingParties for the 2nd distribution.
    expect(result.secondDistribution.qualifyingParties).not.toContain('KEKK');
    // …but it MUST appear in the excluded-below-threshold list with ~3.27 %.
    const kekkExcl = result.secondDistribution.excludedBelowThreshold.find(
      (e) => e.partyId === 'KEKK'
    );
    expect(kekkExcl).toBeDefined();
    expect(kekkExcl!.nationalShare).toBeCloseTo(3.27, 1);

    // Seven major parties all qualify.
    for (const pid of ['DISY', 'AKEL', 'DIKO', 'ELAM', 'EDEK', 'DIPA', 'KOSP'] as PartyId[]) {
      expect(result.secondDistribution.qualifyingParties).toContain(pid);
    }
  });
});

// ============================================================
// Synthetic end-to-end three-stage exercise
// ============================================================

describe('synthetic end-to-end run exercises all three stages', () => {
  // Three small districts, 9 seats total. Two parties clearly above 7.2 %,
  // one party between 3.6 % and 7.2 % (so it gets stage-2 seats but is locked
  // out of stage 3), and one fringe party well below 3.6 %.
  const SMALL_DISTRICTS: Record<DistrictId, number> = {
    NIC: 4,
    LIM: 3,
    FAM: 2,
    LAR: 0,
    PAF: 0,
    KYR: 0
  };

  it('runs all three stages, applies both thresholds, and conserves total seats', () => {
    const input: AllocationInput = { districtBreakdown: emptyDistrictBreakdown() };
    // National-share targets (over a synthetic 10,000-vote universe):
    //   ALPHA = 50.0 %  (DISY proxy)
    //   BETA  = 30.0 %  (AKEL proxy)
    //   GAMMA = 13.0 %  (DIKO proxy, > 7.2 %)
    //   DELTA =  5.0 %  (DIPA proxy, between 3.6 % and 7.2 %)
    //   EPS   =  2.0 %  (KEKK proxy, sub-threshold)
    input.districtBreakdown.NIC = {
      DISY: 2000, // ALPHA in NIC
      AKEL: 1200,
      DIKO: 500,
      DIPA: 200,
      KEKK: 100
    };
    input.districtBreakdown.LIM = {
      DISY: 1500,
      AKEL: 900,
      DIKO: 400,
      DIPA: 150,
      KEKK: 50
    };
    input.districtBreakdown.FAM = {
      DISY: 1500,
      AKEL: 900,
      DIKO: 400,
      DIPA: 150,
      KEKK: 50
    };

    const result = allocateSeats(input, SMALL_DISTRICTS, THRESHOLDS_2021);

    // Total valid votes = 10,000 across the three districts.
    expect(result.totalValidVotes).toBe(10000);
    expect(result.totalSeats).toBe(9);

    // KEKK is below 3.6 % nationally → excluded from second distribution.
    expect(result.secondDistribution.qualifyingParties).not.toContain('KEKK');
    expect(
      result.secondDistribution.excludedBelowThreshold.some((e) => e.partyId === 'KEKK')
    ).toBe(true);

    // DIPA is at 5 % (above 3.6 %, below 7.2 %) → qualifies for stage 2
    // but NOT for stage 3.
    expect(result.secondDistribution.qualifyingParties).toContain('DIPA');
    expect(result.thirdDistribution.qualifyingParties).not.toContain('DIPA');

    // DISY, AKEL, DIKO are all above 7.2 % → qualify for stage 3.
    for (const pid of ['DISY', 'AKEL', 'DIKO'] as PartyId[]) {
      expect(result.thirdDistribution.qualifyingParties).toContain(pid);
    }

    // Seats must conserve: stage1 + stage2 + stage3 = total seats.
    const stage1 = result.firstDistribution.reduce((a, d) => a + d.seatsAllocated, 0);
    const stage2 = result.secondDistribution.seatsAllocated;
    const stage3 = result.thirdDistribution.seatsAllocated;
    expect(stage1 + stage2 + stage3).toBe(result.totalSeats);

    // Per-party total seats must equal sum of seats across all districts.
    const partySums = new Map<PartyId, number>();
    for (const d of result.perDistrict) {
      for (const p of d.perParty) {
        partySums.set(p.partyId, (partySums.get(p.partyId) ?? 0) + p.seats);
      }
    }
    for (const { partyId, seats } of result.perParty) {
      expect(partySums.get(partyId) ?? 0).toBe(seats);
    }

    // Each district must end up exactly full.
    for (const trace of result.firstDistribution) {
      const filled = result.perDistrict
        .find((d) => d.districtId === trace.districtId)!
        .perParty.reduce((a, p) => a + p.seats, 0);
      expect(filled).toBe(trace.totalSeats);
    }

    // KEKK must win zero seats anywhere (sub-threshold).
    for (const d of result.perDistrict) {
      expect(seatsOf(result, d.districtId, 'KEKK')).toBe(0);
    }
  });
});

// ============================================================
// Result structure invariants
// ============================================================

describe('AllocationResult structural invariants', () => {
  it('every district trace lists every party that voted there', () => {
    const input: AllocationInput = { districtBreakdown: emptyDistrictBreakdown() };
    input.districtBreakdown.NIC = { DISY: 1000, AKEL: 800 };
    input.districtBreakdown.LIM = { DISY: 500 };
    const seats: Record<DistrictId, number> = {
      NIC: 2, LIM: 1, FAM: 0, LAR: 0, PAF: 0, KYR: 0
    };
    const result = allocateSeats(input, seats, THRESHOLDS_2021);
    const nic = result.firstDistribution.find((d) => d.districtId === 'NIC')!;
    expect(nic.perParty.map((p) => p.partyId).sort()).toEqual(['AKEL', 'DISY']);
  });

  it('handles districts with zero seats gracefully (no division-by-zero)', () => {
    const input: AllocationInput = { districtBreakdown: emptyDistrictBreakdown() };
    input.districtBreakdown.NIC = { DISY: 100 };
    const seats: Record<DistrictId, number> = {
      NIC: 0, LIM: 0, FAM: 0, LAR: 0, PAF: 0, KYR: 0
    };
    const result = allocateSeats(input, seats, THRESHOLDS_2021);
    expect(result.totalSeats).toBe(0);
    expect(result.firstDistribution[0].quota).toBe(0);
  });
});
