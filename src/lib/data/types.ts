// Shared types for Cyprus 2026 election data.
// Imported by data/* (definitions) and by election-algorithm.ts (consumers).

export type Lang = 'en' | 'el';

export type Bilingual = { en: string; el: string };

export type DistrictId = 'NIC' | 'LIM' | 'FAM' | 'LAR' | 'PAF' | 'KYR';

export interface District {
  id: DistrictId;
  name: Bilingual;
  seats2021: number;
  seats2026: number;
  registeredVoters2026: number;
  ballotColour: string;
  ballotColourLabel: Bilingual;
  preferenceCrosses: number;
}

export type PartyId =
  | 'DISY' | 'AKEL' | 'DIKO' | 'ELAM' | 'EDEK' | 'DIPA' | 'KOSP'
  | 'ALMA' | 'ADK' | 'VOLT' | 'DEK' | 'DIMAL' | 'KEKK' | 'LAKE'
  | 'SIKOU' | 'FARL' | 'POPSF' | 'AGRO' | 'GRNC';

export interface Party {
  id: PartyId;
  name: Bilingual;
  shortName: Bilingual;
  leader: Bilingual;
  colour: string;
  alignment: Bilingual;
  contested2021: boolean;
  seatsOutgoing: number | null; // seats at parliament dissolution Apr 2026
  newParty: boolean;
  notes?: Bilingual;
}

// 2021 baseline: national vote totals and per-district vote totals.
export interface Result2021Entry {
  partyId: PartyId;
  nationalVotes: number;
  nationalShare: number; // percent
  totalSeats: number;
  perDistrict: Partial<Record<DistrictId, { votes: number; seats: number }>>;
}

export interface PollEntry {
  // ISO date (start of fieldwork)
  fieldworkStart: string;
  fieldworkEnd: string;
  pollster: string;
  commissioner: string;
  sample: number | null;
  marginOfError: number | null; // percentage points
  // First-preference vote intentions (raw, percent). Null if not reported.
  shares: Partial<Record<PartyId, number>>;
  notes?: string;
  // If the pollster also published seat projections.
  seatProjection?: Partial<Record<PartyId, [number, number] | number>>;
  undecidedPct?: number | null;
}

// Threshold constants for the 3-stage allocation.
export interface ThresholdSet {
  // Required nationwide share (%) for a single party to participate in the 2nd distribution.
  singleParty: number;
  // Required nationwide share (%) for a 2-party coalition to participate.
  twoPartyCoalition: number;
  // Required nationwide share (%) for a 3+ party coalition to participate.
  largeCoalition: number;
  // Required nationwide share (%) to receive residual seats in the 3rd distribution.
  residual: number;
}

// ---- Algorithm I/O ----

export type DistrictVoteBreakdown = Record<DistrictId, Partial<Record<PartyId, number>>>;

export interface AllocationInput {
  districtBreakdown: DistrictVoteBreakdown;
}

export interface FirstDistributionDistrictTrace {
  districtId: DistrictId;
  totalSeats: number;
  validVotes: number;
  quota: number;
  perParty: {
    partyId: PartyId;
    votes: number;
    seatsWon: number;
    unusedVotes: number;
  }[];
  seatsAllocated: number;
  seatsRemaining: number;
}

export interface SecondDistributionTrace {
  qualifyingParties: PartyId[];
  excludedBelowThreshold: { partyId: PartyId; nationalShare: number }[];
  totalUnusedVotes: number;
  seatsRemaining: number;
  quota: number;
  perParty: { partyId: PartyId; unusedVotes: number; seatsWon: number }[];
  seatsAllocated: number;
}

export interface ThirdDistributionTrace {
  qualifyingParties: PartyId[];
  seatsRemaining: number;
  perParty: { partyId: PartyId; remainingUnusedVotes: number; seatsWon: number }[];
  seatsAllocated: number;
}

export interface AllocationResult {
  perParty: { partyId: PartyId; seats: number }[];
  perDistrict: { districtId: DistrictId; perParty: { partyId: PartyId; seats: number }[] }[];
  firstDistribution: FirstDistributionDistrictTrace[];
  secondDistribution: SecondDistributionTrace;
  thirdDistribution: ThirdDistributionTrace;
  totalSeats: number;
  totalValidVotes: number;
}
