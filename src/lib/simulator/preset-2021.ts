// Real 2021 district vote breakdown, derived from the data.gov.cy Ministry of
// Interior polling-station-level CSV (aggregated in $data/results-2021.ts).
//
// Each qualifying party's per-district vote count is the historical number.
// The per-district residual (= VALID_VOTES_BY_DISTRICT_2021[d] minus the sum
// of qualifying-party votes in d) covers sub-threshold lists - Generation
// Change (2.82 %), Solidarity Movement (2.31 %), and smaller independents.
// We park that residual on PartyId slots that did NOT contest 2021, split
// across several so no bucket clears the 3.6 % single-party threshold and
// contaminates the second distribution.
//
// Together with PRESET_2021_DISTRICT_SEATS (Nicosia 20, Paphos 4), feeding
// this into `allocateSeats` reproduces the historical 2021 outcome:
//   DISY 17 / AKEL 15 / DIKO 9 / ELAM 4 / EDEK 4 / DIPA 4 / KOSP 3 = 56.

import { DISTRICTS } from '../data/districts';
import {
  RESULTS_2021,
  VALID_VOTES_BY_DISTRICT_2021
} from '../data/results-2021';
import type {
  DistrictId,
  DistrictVoteBreakdown,
  PartyId
} from '../data/types';

// Sub-threshold residual is split across these slots. They are 2026-new
// parties (no 2021 votes of their own), so co-opting them as filler buckets
// does not collide with real 2021 party data. With ~40k residual votes split
// 5 ways, each bucket lands near 2.3 % nationally — well under 3.6 %.
const RESIDUAL_BUCKETS: PartyId[] = ['ALMA', 'ADK', 'VOLT', 'DEK', 'DIMAL'];

function buildBreakdown(): DistrictVoteBreakdown {
  const out = {} as DistrictVoteBreakdown;
  for (const district of DISTRICTS) {
    const did = district.id;
    const row: Partial<Record<PartyId, number>> = {};
    let qualifyingSum = 0;
    for (const r of RESULTS_2021) {
      const cell = r.perDistrict[did];
      if (cell && cell.votes > 0) {
        row[r.partyId] = cell.votes;
        qualifyingSum += cell.votes;
      }
    }
    const residual = VALID_VOTES_BY_DISTRICT_2021[did] - qualifyingSum;
    if (residual > 0) {
      const base = Math.floor(residual / RESIDUAL_BUCKETS.length);
      const remainder = residual - base * RESIDUAL_BUCKETS.length;
      RESIDUAL_BUCKETS.forEach((pid, i) => {
        row[pid] = base + (i === 0 ? remainder : 0);
      });
    }
    out[did] = row;
  }
  return out;
}

export const PRESET_2021_BREAKDOWN: DistrictVoteBreakdown = buildBreakdown();

// 2021 seat counts per district (Nicosia 20, Paphos 4) — required to
// reproduce the historic allocation alongside PRESET_2021_BREAKDOWN.
export const PRESET_2021_DISTRICT_SEATS: Record<DistrictId, number> =
  DISTRICTS.reduce(
    (acc, d) => {
      acc[d.id] = d.seats2021;
      return acc;
    },
    {} as Record<DistrictId, number>
  );
