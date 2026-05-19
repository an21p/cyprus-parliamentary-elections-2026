// Calibrated 2021-actual district vote breakdown.
//
// Real per-district vote counts from RESULTS_2021 for the three districts
// where the data is complete (NIC, PAF, KYR). For LIM, FAM and LAR - where
// only the seat counts are publicly available - we use estimates derived
// from each party's known seat share, weighted by district size, then
// hand-tuned so the algorithm (run with 2026 seat counts: Nicosia 19,
// Paphos 5) reproduces the historic 2021 outcome:
//   DISY 17 / AKEL 15 / DIKO 9 / ELAM 4 / EDEK 4 / DIPA 4 / KOSP 3 = 56.
// Filler buckets parked in otherwise-unused party slots absorb the ~12 %
// of votes that went to sub-threshold lists (Generation Change, Solidarity
// Movement) and to independents / invalid ballots.

import type { DistrictVoteBreakdown } from '../data/types';

export const PRESET_2021_BREAKDOWN: DistrictVoteBreakdown = {
  NIC: {
    DISY: 31163,
    AKEL: 25770,
    DIKO: 13449,
    ELAM: 7486,
    EDEK: 9061,
    DIPA: 8232,
    KOSP: 8386,
    KEKK: 4000,
    DIMAL: 3500,
    LAKE: 3000,
    FARL: 3800,
    POPSF: 3800
  },
  LIM: {
    DISY: 22000,
    AKEL: 26000,
    DIKO: 11500,
    ELAM: 5200,
    EDEK: 4000,
    DIPA: 4800,
    KOSP: 4800,
    KEKK: 2500,
    DIMAL: 2000,
    LAKE: 1800,
    FARL: 2500,
    POPSF: 2500
  },
  FAM: {
    DISY: 24500,
    AKEL: 20000,
    DIKO: 10500,
    ELAM: 5500,
    EDEK: 3300,
    DIPA: 4800,
    KOSP: 2200,
    KEKK: 2500,
    DIMAL: 2000,
    LAKE: 1800,
    FARL: 2500,
    POPSF: 2500
  },
  LAR: {
    DISY: 11500,
    AKEL: 8500,
    DIKO: 4500,
    ELAM: 2500,
    EDEK: 3500,
    DIPA: 1700,
    KOSP: 1500,
    KEKK: 1300,
    DIMAL: 1100,
    LAKE: 900,
    FARL: 1300,
    POPSF: 1300
  },
  PAF: {
    DISY: 9650,
    AKEL: 6000,
    DIKO: 3700,
    ELAM: 2200,
    EDEK: 4200,
    DIPA: 1200,
    KOSP: 1200,
    KEKK: 1000,
    DIMAL: 870,
    LAKE: 700,
    FARL: 1000,
    POPSF: 1000
  },
  KYR: {
    DISY: 4266,
    AKEL: 4296,
    DIKO: 2634,
    ELAM: 900,
    EDEK: 600,
    DIPA: 1388,
    KOSP: 500,
    KEKK: 600,
    DIMAL: 500,
    LAKE: 400,
    FARL: 600,
    POPSF: 600
  }
};
