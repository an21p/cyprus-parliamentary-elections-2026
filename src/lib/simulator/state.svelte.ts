// Svelte 5 rune-based store for the simulator page.
//
// Holds (a) per-party national vote share %, (b) estimated turnout fraction,
// (c) the district seat-boundary year (2021 or 2026 — the October 2025 reform
// moved one seat from Nicosia to Paphos), and (d) an optional explicit
// district breakdown override (used by the "2021 actual" preset so the
// historical result is reproduced exactly).
// Derives an AllocationResult by feeding the chosen breakdown and seat map
// through the 3-stage `allocateSeats` algorithm.

import { allocateSeats } from '../election-algorithm';
import { DISTRICTS } from '../data/districts';
import { PARTIES } from '../data/parties';
import { RESULTS_2021 } from '../data/results-2021';
import { POLLS } from '../data/polls';
import { THRESHOLDS } from '../data/thresholds';
import type {
  AllocationResult,
  DistrictId,
  DistrictVoteBreakdown,
  PartyId
} from '../data/types';
import { deriveDistrictVotes } from './derive-district-votes';
import {
  PRESET_2021_BREAKDOWN,
  PRESET_2021_DISTRICT_SEATS
} from './preset-2021';

// 2026 seats per district (after the Nicosia → Paphos seat transfer).
const SEATS_2026: Record<DistrictId, number> = DISTRICTS.reduce(
  (acc, d) => {
    acc[d.id] = d.seats2026;
    return acc;
  },
  {} as Record<DistrictId, number>
);

export type BoundariesYear = 2021 | 2026;

export const DEFAULT_TURNOUT = 0.62;

// Empty per-party share map. Every party listed in PARTIES gets an entry at
// 0 so the input UI shape stays stable across resets / presets.
function blankShares(): Record<PartyId, number> {
  const out = {} as Record<PartyId, number>;
  for (const p of PARTIES) out[p.id] = 0;
  return out;
}

interface PresetMeta {
  label: { en: string; el: string };
}

export interface SimulatorStore {
  shares: Record<PartyId, number>;
  turnout: number;
  boundariesYear: BoundariesYear;
  readonly allocation: AllocationResult;
  readonly totalSharePct: number;
  readonly seatsByParty: Map<PartyId, number>;
  readonly activePresetLabel: { en: string; el: string } | null;
  readonly districtSeats: Record<DistrictId, number>;
  setShare(pid: PartyId, value: number): void;
  setTurnout(value: number): void;
  setBoundariesYear(year: BoundariesYear): void;
  reset(): void;
  apply2021Actual(): void;
  applyPoll(index: number): void;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export function createSimulatorStore(): SimulatorStore {
  const state = $state<{
    shares: Record<PartyId, number>;
    turnout: number;
    boundariesYear: BoundariesYear;
    overrideBreakdown: DistrictVoteBreakdown | null;
    activePresetMeta: PresetMeta | null;
  }>({
    shares: blankShares(),
    turnout: DEFAULT_TURNOUT,
    boundariesYear: 2026,
    overrideBreakdown: null,
    activePresetMeta: null
  });

  const districtSeats = $derived<Record<DistrictId, number>>(
    state.boundariesYear === 2021 ? PRESET_2021_DISTRICT_SEATS : SEATS_2026
  );

  // Allocation re-runs on every input change. With 6 districts and < 20
  // parties this is sub-millisecond, so no memoisation needed.
  const allocation = $derived.by<AllocationResult>(() => {
    const breakdown =
      state.overrideBreakdown ??
      deriveDistrictVotes(state.shares, state.turnout);
    return allocateSeats(
      { districtBreakdown: breakdown },
      districtSeats,
      THRESHOLDS
    );
  });

  const totalSharePct = $derived.by<number>(() => {
    let sum = 0;
    for (const v of Object.values(state.shares)) sum += v;
    return sum;
  });

  const seatsByParty = $derived.by<Map<PartyId, number>>(() => {
    const m = new Map<PartyId, number>();
    for (const row of allocation.perParty) m.set(row.partyId, row.seats);
    return m;
  });

  // ---- Mutators -----------------------------------------------------------

  function setShare(pid: PartyId, value: number): void {
    state.shares[pid] = clamp(value, 0, 100);
    // Any manual edit invalidates the active preset and clears the override.
    state.activePresetMeta = null;
    state.overrideBreakdown = null;
  }

  function setTurnout(value: number): void {
    state.turnout = clamp(value, 0, 1);
    // Changing turnout doesn't invalidate a poll preset, but the 2021-actual
    // preset uses a fixed breakdown, so changing turnout there has no
    // effect on the result. Clear the override flag if user changes turnout
    // so the simulator picks up the change.
    if (state.overrideBreakdown) {
      state.overrideBreakdown = null;
      // keep the shares so the user can see what was loaded
    }
  }

  function setBoundariesYear(year: BoundariesYear): void {
    state.boundariesYear = year;
  }

  function reset(): void {
    state.shares = blankShares();
    state.turnout = DEFAULT_TURNOUT;
    state.boundariesYear = 2026;
    state.activePresetMeta = null;
    state.overrideBreakdown = null;
  }

  function apply2021Actual(): void {
    // Show the canonical 2021 national shares in the inputs panel.
    const shares = blankShares();
    for (const r of RESULTS_2021) shares[r.partyId] = r.nationalShare;
    state.shares = shares;
    state.turnout = 0.6572; // 2021 actual turnout
    // Real 2021 vote breakdown + 2021 seat counts (Nicosia 20, Paphos 4) so
    // the algorithm reproduces the historic 17/15/9/4/4/4/3 outcome.
    state.overrideBreakdown = PRESET_2021_BREAKDOWN;
    state.boundariesYear = 2021;
    state.activePresetMeta = {
      label: { en: '2021 actual', el: 'Πραγματικό 2021' }
    };
  }

  function applyPoll(index: number): void {
    const poll = POLLS[index];
    if (!poll) return;
    const shares = blankShares();
    for (const [pid, v] of Object.entries(poll.shares)) {
      if (typeof v === 'number') shares[pid as PartyId] = v;
    }
    state.shares = shares;
    state.overrideBreakdown = null;
    // Polls are forward-looking — default to 2026 boundaries.
    state.boundariesYear = 2026;
    // Keep turnout at user's current setting - polls don't predict turnout.
    state.activePresetMeta = {
      label: {
        en: `${poll.pollster}, ${poll.fieldworkEnd}`,
        el: `${poll.pollster}, ${poll.fieldworkEnd}`
      }
    };
  }

  return {
    get shares() {
      return state.shares;
    },
    set shares(v) {
      state.shares = v;
      state.overrideBreakdown = null;
      state.activePresetMeta = null;
    },
    get turnout() {
      return state.turnout;
    },
    set turnout(v) {
      setTurnout(v);
    },
    get boundariesYear() {
      return state.boundariesYear;
    },
    set boundariesYear(v) {
      setBoundariesYear(v);
    },
    get allocation() {
      return allocation;
    },
    get totalSharePct() {
      return totalSharePct;
    },
    get seatsByParty() {
      return seatsByParty;
    },
    get activePresetLabel() {
      return state.activePresetMeta?.label ?? null;
    },
    get districtSeats() {
      return districtSeats;
    },
    setShare,
    setTurnout,
    setBoundariesYear,
    reset,
    apply2021Actual,
    applyPoll
  };
}

// Single page-scoped store instance.
export const simulatorState: SimulatorStore = createSimulatorStore();
