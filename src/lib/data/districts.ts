import type { District, DistrictId } from './types';

export const DISTRICTS: District[] = [
  {
    id: 'NIC',
    name: { en: 'Nicosia', el: 'Λευκωσία' },
    seats2021: 20,
    seats2026: 19,
    registeredVoters2026: 198376,
    ballotColour: '#f5f5f5',
    ballotColourLabel: { en: 'White', el: 'Λευκό' },
    preferenceCrosses: 5
  },
  {
    id: 'LIM',
    name: { en: 'Limassol', el: 'Λεμεσός' },
    seats2021: 12,
    seats2026: 12,
    registeredVoters2026: 117052,
    ballotColour: '#ffeb3b',
    ballotColourLabel: { en: 'Yellow', el: 'Κίτρινο' },
    preferenceCrosses: 3
  },
  {
    id: 'FAM',
    name: { en: 'Famagusta', el: 'Αμμόχωστος' },
    seats2021: 11,
    seats2026: 11,
    registeredVoters2026: 116345,
    ballotColour: '#2196f3',
    ballotColourLabel: { en: 'Blue', el: 'Μπλε' },
    preferenceCrosses: 3
  },
  {
    id: 'LAR',
    name: { en: 'Larnaca', el: 'Λάρνακα' },
    seats2021: 6,
    seats2026: 6,
    registeredVoters2026: 60561,
    ballotColour: '#f48fb1',
    ballotColourLabel: { en: 'Pink', el: 'Ροζ' },
    preferenceCrosses: 2
  },
  {
    id: 'PAF',
    name: { en: 'Paphos', el: 'Πάφος' },
    seats2021: 4,
    seats2026: 5,
    registeredVoters2026: 47429,
    ballotColour: '#4caf50',
    ballotColourLabel: { en: 'Green', el: 'Πράσινο' },
    preferenceCrosses: 2
  },
  {
    id: 'KYR',
    name: { en: 'Kyrenia', el: 'Κερύνεια' },
    seats2021: 3,
    seats2026: 3,
    registeredVoters2026: 28824,
    ballotColour: '#ff9800',
    ballotColourLabel: { en: 'Orange', el: 'Πορτοκαλί' },
    preferenceCrosses: 1
  }
];

export function getDistrict(id: DistrictId): District {
  const district = DISTRICTS.find((d) => d.id === id);
  if (!district) {
    throw new Error(`Unknown district id: ${id}`);
  }
  return district;
}
