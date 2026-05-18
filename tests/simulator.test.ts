// Verifies the simulator's "2021 actual" preset reproduces the historical
// 2021 seat distribution exactly:
//   DISY 17 / AKEL 15 / DIKO 9 / ELAM 4 / EDEK 4 / DIPA 4 / KOSP 3 = 56
// using the 2026 seat counts (Nicosia 19, Paphos 5) and the calibrated
// per-district vote breakdown baked into the preset.
//
// We test the pure functions directly (not the Svelte 5 rune store, which
// requires the Svelte compiler — covered by the integration build).

import { describe, expect, it } from 'vitest';
import { allocateSeats } from '../src/lib/election-algorithm';
import { PRESET_2021_BREAKDOWN } from '../src/lib/simulator/preset-2021';
import { deriveDistrictVotes } from '../src/lib/simulator/derive-district-votes';
import { DISTRICTS } from '../src/lib/data/districts';
import { THRESHOLDS } from '../src/lib/data/thresholds';
import type { DistrictId, PartyId } from '../src/lib/data/types';

const SEATS_2026: Record<DistrictId, number> = DISTRICTS.reduce(
  (acc, d) => {
    acc[d.id] = d.seats2026;
    return acc;
  },
  {} as Record<DistrictId, number>
);

describe('simulator 2021-actual preset', () => {
  it('reproduces the historical 2021 seat distribution exactly', () => {
    const result = allocateSeats(
      { districtBreakdown: PRESET_2021_BREAKDOWN },
      SEATS_2026,
      THRESHOLDS
    );

    const totalSeats = result.perParty.reduce((a, p) => a + p.seats, 0);
    expect(totalSeats).toBe(56);

    const seats = new Map<PartyId, number>();
    for (const row of result.perParty) seats.set(row.partyId, row.seats);
    expect(seats.get('DISY')).toBe(17);
    expect(seats.get('AKEL')).toBe(15);
    expect(seats.get('DIKO')).toBe(9);
    expect(seats.get('ELAM')).toBe(4);
    expect(seats.get('EDEK')).toBe(4);
    expect(seats.get('DIPA')).toBe(4);
    expect(seats.get('KOSP')).toBe(3);
    // KEKK was 3.27 % nationally — under the 3.6 % threshold.
    expect(seats.get('KEKK')).toBeUndefined();

    // Every district is fully seated.
    for (const dist of result.perDistrict) {
      const filled = dist.perParty.reduce((a, p) => a + p.seats, 0);
      expect(filled).toBe(SEATS_2026[dist.districtId]);
    }
  });
});

describe('deriveDistrictVotes', () => {
  it('returns an empty district breakdown when all shares are zero', () => {
    const out = deriveDistrictVotes({}, 0.62);
    for (const d of DISTRICTS) {
      expect(out[d.id]).toEqual({});
    }
  });

  it('assigns positive integer vote counts to every district', () => {
    const out = deriveDistrictVotes({ DISY: 27 }, 0.62);
    for (const d of DISTRICTS) {
      const votes = out[d.id].DISY ?? 0;
      expect(Number.isInteger(votes)).toBe(true);
      expect(votes).toBeGreaterThan(0);
    }
  });

  it('new parties (no 2021 baseline) get uniform-by-registered-voters distribution', () => {
    const out = deriveDistrictVotes({ ALMA: 10 }, 1.0);
    // Ratio of ALMA votes in district to district registered voters should be
    // ~equal across districts (the share = constant × registered × turnout).
    const ratios: number[] = [];
    for (const d of DISTRICTS) {
      const votes = out[d.id].ALMA ?? 0;
      ratios.push(votes / d.registeredVoters2026);
    }
    const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    for (const r of ratios) {
      expect(Math.abs(r - mean) / mean).toBeLessThan(0.005); // tighter than 0.5 %
    }
  });
});
