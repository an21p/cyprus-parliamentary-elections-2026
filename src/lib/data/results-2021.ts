import type { Result2021Entry } from './types';

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
      LIM: { votes: 0, seats: 3 },
      FAM: { votes: 0, seats: 4 },
      LAR: { votes: 0, seats: 2 },
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
      LIM: { votes: 0, seats: 3 },
      FAM: { votes: 0, seats: 3 },
      LAR: { votes: 0, seats: 1 },
      PAF: { votes: 0, seats: 1 },
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
      LIM: { votes: 0, seats: 2 },
      FAM: { votes: 0, seats: 2 },
      LAR: { votes: 0, seats: 1 },
      PAF: { votes: 0, seats: 1 },
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
      LIM: { votes: 0, seats: 1 },
      FAM: { votes: 0, seats: 1 },
      LAR: { votes: 0, seats: 1 }
    }
  },
  {
    partyId: 'EDEK',
    nationalVotes: 24022,
    nationalShare: 6.72,
    totalSeats: 4,
    perDistrict: {
      NIC: { votes: 9061, seats: 1 },
      LIM: { votes: 0, seats: 1 },
      LAR: { votes: 0, seats: 1 },
      PAF: { votes: 0, seats: 1 }
    }
  },
  {
    partyId: 'DIPA',
    nationalVotes: 21832,
    nationalShare: 6.10,
    totalSeats: 4,
    perDistrict: {
      NIC: { votes: 8232, seats: 2 },
      LIM: { votes: 0, seats: 1 },
      FAM: { votes: 0, seats: 1 },
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
      LIM: { votes: 0, seats: 1 }
    }
  },
  {
    partyId: 'KEKK',
    nationalVotes: 11712,
    nationalShare: 3.27,
    totalSeats: 0,
    perDistrict: {}
  }
];

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
