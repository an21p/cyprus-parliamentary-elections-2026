import type { Result2021Entry } from './types';

// Source: data.gov.cy "Επίσημα Αποτελέσματα Βουλευτικών Εκλογών 2021" — the
// Ministry of Interior's polling-station-level CSV, aggregated by election
// district × party. The dataset omits invalid ballots, so the row total
// (354,557) is lower than the often-cited 357,712 valid-vote figure. The
// six-district sums per qualifying party reproduce the national totals
// reported in research/compass §1.7 exactly.
export const TOTAL_VALID_VOTES_2021 = 357712;
export const TOTAL_TURNOUT_2021 = 0.6572;

export const RESULTS_2021: Result2021Entry[] = [
  {
    partyId: 'DISY',
    nationalVotes: 99328,
    nationalShare: 27.77,
    totalSeats: 17,
    perDistrict: {
      NIC: { votes: 31163, seats: 5 },
      LIM: { votes: 20733, seats: 3 },
      FAM: { votes: 23593, seats: 4 },
      LAR: { votes: 9923, seats: 2 },
      PAF: { votes: 9650, seats: 1 },
      KYR: { votes: 4266, seats: 2 }
    }
  },
  {
    partyId: 'AKEL',
    nationalVotes: 79913,
    nationalShare: 22.34,
    totalSeats: 15,
    perDistrict: {
      NIC: { votes: 25770, seats: 6 },
      LIM: { votes: 16019, seats: 3 },
      FAM: { votes: 18281, seats: 3 },
      LAR: { votes: 10008, seats: 1 },
      PAF: { votes: 5539, seats: 1 },
      KYR: { votes: 4296, seats: 1 }
    }
  },
  {
    partyId: 'DIKO',
    nationalVotes: 40395,
    nationalShare: 11.29,
    totalSeats: 9,
    perDistrict: {
      NIC: { votes: 13449, seats: 3 },
      LIM: { votes: 9628, seats: 2 },
      FAM: { votes: 5030, seats: 2 },
      LAR: { votes: 3687, seats: 1 },
      PAF: { votes: 5967, seats: 1 },
      KYR: { votes: 2634, seats: 0 }
    }
  },
  {
    partyId: 'ELAM',
    nationalVotes: 24255,
    nationalShare: 6.78,
    totalSeats: 4,
    perDistrict: {
      NIC: { votes: 7486, seats: 1 },
      LIM: { votes: 4741, seats: 1 },
      FAM: { votes: 5786, seats: 1 },
      LAR: { votes: 2911, seats: 1 },
      PAF: { votes: 2360, seats: 0 },
      KYR: { votes: 971, seats: 0 }
    }
  },
  {
    partyId: 'EDEK',
    nationalVotes: 24022,
    nationalShare: 6.72,
    totalSeats: 4,
    perDistrict: {
      NIC: { votes: 9061, seats: 1 },
      LIM: { votes: 3473, seats: 1 },
      FAM: { votes: 2975, seats: 0 },
      LAR: { votes: 3314, seats: 1 },
      PAF: { votes: 4293, seats: 1 },
      KYR: { votes: 906, seats: 0 }
    }
  },
  {
    partyId: 'DIPA',
    nationalVotes: 21832,
    nationalShare: 6.10,
    totalSeats: 4,
    perDistrict: {
      NIC: { votes: 8232, seats: 2 },
      LIM: { votes: 4672, seats: 1 },
      FAM: { votes: 3685, seats: 1 },
      LAR: { votes: 2670, seats: 0 },
      PAF: { votes: 1185, seats: 0 },
      KYR: { votes: 1388, seats: 0 }
    }
  },
  {
    partyId: 'KOSP',
    nationalVotes: 15762,
    nationalShare: 4.41,
    totalSeats: 3,
    perDistrict: {
      NIC: { votes: 8386, seats: 2 },
      LIM: { votes: 2421, seats: 1 },
      FAM: { votes: 2090, seats: 0 },
      LAR: { votes: 829, seats: 0 },
      PAF: { votes: 1153, seats: 0 },
      KYR: { votes: 883, seats: 0 }
    }
  },
  {
    partyId: 'KEKK',
    nationalVotes: 11712,
    nationalShare: 3.27,
    totalSeats: 0,
    perDistrict: {
      NIC: { votes: 2704, seats: 0 },
      LIM: { votes: 1987, seats: 0 },
      FAM: { votes: 4463, seats: 0 },
      LAR: { votes: 1207, seats: 0 },
      PAF: { votes: 834, seats: 0 },
      KYR: { votes: 517, seats: 0 }
    }
  }
];

// Per-district valid-vote totals (qualifying + sub-threshold + small lists).
// Sourced from the same MOI CSV (data.gov.cy/Parliamentary2021.csv) so the
// Hare quota for each district can be reproduced exactly:
//   quota = floor(VALID_VOTES_BY_DISTRICT_2021[d] / districts[d].seats2021)
export const VALID_VOTES_BY_DISTRICT_2021: Record<
  'NIC' | 'LIM' | 'FAM' | 'LAR' | 'PAF' | 'KYR',
  number
> = {
  NIC: 122347,
  LIM: 72635,
  FAM: 74869,
  LAR: 38007,
  PAF: 32298,
  KYR: 17556
};

// Sub-threshold parties without a current PartyId mapping (Generation Change, Solidarity Movement)
// are tracked here for completeness of the 2021 totals but cannot be typed as Result2021Entry
// because they have no PartyId enum value.
export const SUB_THRESHOLD_OTHER_2021: {
  nameEn: string;
  nameEl: string;
  votes: number;
  share: number;
}[] = [
  {
    nameEn: 'Generation Change',
    nameEl: 'Γενιά Αλλαγής',
    votes: 10095,
    share: 2.82
  },
  {
    nameEn: 'Solidarity Movement',
    nameEl: 'Κίνημα Αλληλεγγύη',
    votes: 8254,
    share: 2.31
  }
];
