// Accessibility preferences — currently a single toggle for a colourblind-safe
// party palette. Module-scoped Svelte 5 rune state, persisted in localStorage,
// SSR-safe (initialises to `false` during prerender so the static HTML matches
// the default brand palette).
//
// Components read party colour via `partyColour(partyId)`. Because the helper
// reads from `a11yPrefs` (a `$state` rune), every template/derived that calls
// it tracks the preference and re-renders when it flips.

import { browser } from '$app/environment';
import { getParty } from '$data/parties';
import type { PartyId } from '$data/types';

const STORAGE_KEY = 'a11y.colourblind';

// Okabe–Ito (2008) "Color Universal Design" palette plus Bang Wong's
// complementary tones. The first 8 entries (Okabe–Ito) are designed to be
// pairwise-distinguishable under the three common forms of colourblindness;
// the rest extend the palette for the long tail of small parties.
//
// Mapping rule of thumb: heavy-rotation parties get the strongest, most
// orthogonal hues; smaller parties take the remaining slots and are not
// guaranteed to be distinguishable from each other (they rarely appear in the
// same chart).
const COLOURBLIND_PALETTE: Record<PartyId, string> = {
  DISY: '#0072B2', // Okabe–Ito blue
  AKEL: '#D55E00', // Okabe–Ito vermillion
  DIKO: '#56B4E9', // Okabe–Ito sky blue
  ELAM: '#000000', // black — kept; CUD reserves black as a signal colour
  EDEK: '#CC79A7', // Okabe–Ito reddish purple
  DIPA: '#009E73', // Okabe–Ito bluish green
  KOSP: '#117733', // Wong dark green
  ALMA: '#E69F00', // Okabe–Ito orange
  ADK: '#737373',  // neutral grey (brand white is invisible against paper)
  VOLT: '#785EF0', // IBM CUD violet
  DEK: '#654321',  // dark earth brown
  DIMAL: '#88CCEE', // Wong light cyan
  KEKK: '#DDCC77', // Wong sand
  LAKE: '#332288', // Wong indigo
  SIKOU: '#FE6100', // IBM CUD bright orange
  FARL: '#882255', // Wong wine
  POPSF: '#AA4499', // Wong purple
  AGRO: '#F0E442', // Okabe–Ito yellow
  GRNC: '#44AA99'  // Wong teal
};

function readInitial(): boolean {
  if (!browser) return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export const a11yPrefs = $state({ colourblind: readInitial() });

export function setColourblind(value: boolean): void {
  a11yPrefs.colourblind = value;
  if (!browser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
  } catch {
    /* storage may be unavailable (private mode / quota) — toggle still works
       within the tab. */
  }
}

export function toggleColourblind(): void {
  setColourblind(!a11yPrefs.colourblind);
}

export function partyColour(partyId: PartyId): string {
  if (a11yPrefs.colourblind) {
    return COLOURBLIND_PALETTE[partyId] ?? getParty(partyId).colour;
  }
  return getParty(partyId).colour;
}

// Curated palette tuned for stacked / multi-band charts. Brand colours are
// kept where they read well; the few that don't (ADK's white, ELAM's pure
// black, KEKK clashing with KOSP green) get nearby substitutes so every
// party stays distinguishable from its neighbours in a single chart. The
// colourblind toggle still wins — it routes through partyColour() below.
const CHART_PALETTE: Partial<Record<PartyId, string>> = {
  DISY: '#1554a3',
  AKEL: '#d62718',
  DIKO: '#14a8c1',
  ELAM: '#2c2c2c',
  EDEK: '#c0345b',
  DIPA: '#1d8c7c',
  KOSP: '#3f8a3a',
  ALMA: '#f0a500',
  ADK: '#9aa0a6',
  VOLT: '#8438cc',
  DEK: '#7a5d4d',
  DIMAL: '#5c6bc0',
  KEKK: '#a3a437',
  LAKE: '#4a2a23',
  SIKOU: '#ef7c1a',
  FARL: '#7a1a4a',
  POPSF: '#8a4c44',
  AGRO: '#bdb422',
  GRNC: '#7ac84a'
};

export function chartPartyColour(partyId: PartyId): string {
  if (a11yPrefs.colourblind) {
    return COLOURBLIND_PALETTE[partyId] ?? partyColour(partyId);
  }
  return CHART_PALETTE[partyId] ?? partyColour(partyId);
}
