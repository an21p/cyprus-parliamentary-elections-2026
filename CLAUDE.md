# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - start the SvelteKit dev server
- `npm run build` - production build (static export via `@sveltejs/adapter-static`; output in `build/`)
- `npm run preview` - serve the production build locally
- `npm run check` - `svelte-kit sync && svelte-check` (typecheck Svelte + TS, including `checkJs`)
- `npm test` - run vitest once
- `npm run test:watch` - vitest in watch mode
- Run a single test file: `npx vitest run tests/election-algorithm.test.ts`
- Run a single test by name: `npx vitest run -t "second distribution"`
- `node scripts/generate-icons.mjs` - regenerate PWA icons / OG image from the district paths in `src/lib/components/map/CyprusMap.svelte` (requires `rsvg-convert` on PATH)

## Architecture

This is a static, prerendered, bilingual (English / Greek) explainer + simulator for the **24 May 2026 Cypriot parliamentary election**. The election uses three-stage "reinforced proportional representation" (district Hare quota → national pool with a 3.6 % threshold → residual pool with a 7.2 % threshold). The site's reason for existing is to show how seats are actually allocated and to let users simulate the outcome from poll inputs. The canonical spec for both the algorithm and the data is in `research/compass_artifact_wf-*.md` - read it before changing seat-allocation logic or party/poll data.

### Static + bilingual routing

- `adapter-static` with `prerender = true` in [src/routes/[lang=lang]/+layout.ts](src/routes/[lang=lang]/+layout.ts). Every page must be prerenderable.
- [src/routes/+page.svelte](src/routes/+page.svelte) is a language picker that hard-navigates (`data-sveltekit-reload`) to `/en` or `/el`.
- All real content lives under `/[lang]/…`. The `lang` route param is constrained by the matcher in [src/params/lang.ts](src/params/lang.ts) - only `en` and `el` resolve; anything else 404s.
- i18n is a flat dictionary in [src/lib/i18n/dict.ts](src/lib/i18n/dict.ts) (`messages[key].{en,el}`). There is no per-locale routing logic beyond the param - components receive `lang` via the layout `data` and call `t(lang, key)` themselves.
- Vite aliases (see [svelte.config.js](svelte.config.js)): `$data` → `src/lib/data`, `$components` → `src/lib/components`, `$i18n` → `src/lib/i18n`. Use these instead of relative paths when crossing boundaries.

### The seat-allocation core

[src/lib/election-algorithm.ts](src/lib/election-algorithm.ts) implements `allocateSeats(input, districtSeats, thresholds)` as a pure, deterministic function. Seat counts and thresholds are **inputs**, not constants - the same routine reproduces 2021 (Nicosia 20, Paphos 4) and runs 2026 (Nicosia 19, Paphos 5). Don't hardcode either. The three traces in `AllocationResult` (`firstDistribution`, `secondDistribution`, `thirdDistribution`) are surfaced verbatim in the simulator UI, so changing their shape is a UI-breaking change.

Tests in [tests/election-algorithm.test.ts](tests/election-algorithm.test.ts) use inline fixtures (worked 2021 examples from the research file). Do **not** make these tests import `data/results-2021.ts`.

### Simulator pipeline

[src/lib/simulator/state.svelte.ts](src/lib/simulator/state.svelte.ts) is a Svelte 5 **runes**-based store (`$state` / `$derived`). The pipeline is:

```
nationalShares (%) ──► deriveDistrictVotes ──► allocateSeats ──► AllocationResult
                       (only approximation)    (exact)
```

[src/lib/simulator/derive-district-votes.ts](src/lib/simulator/derive-district-votes.ts) is the **only approximation** in the chain - it splits national vote shares across six districts using 2021-derived intensity coefficients. It's surfaced in the UI as such; the rest of the chain is exact.

The "2021 actual" preset bypasses the approximation by setting an explicit `overrideBreakdown` from [src/lib/simulator/preset-2021.ts](src/lib/simulator/preset-2021.ts) - a hand-calibrated literal that makes the algorithm reproduce the historic 2021 outcome (17/15/9/4/4/4/3 = 56). Any manual share edit clears the override.

### Polls

Polls live as **one JSON file per poll** in [src/lib/data/polls/](src/lib/data/polls/), named `YYYY-MM-DD-<pollster>.json` by `fieldworkEnd`. [src/lib/data/polls.ts](src/lib/data/polls.ts) is a thin loader that glob-imports them with `import.meta.glob` (eager) and sorts by `fieldworkEnd` descending. To add a poll, drop a new JSON file - nothing else to wire up.

Caveat: the dataset mixes **raw** and **valid-vote redistributed** share bases. Each entry's `notes` field flags which (e.g. "Shares appear to be valid-vote / redistributed"). The `PollEntry.shares` type comment says "raw, percent" but historical entries don't all honor that; don't normalise without checking each entry's note against its primary source.

### Domain types

[src/lib/data/types.ts](src/lib/data/types.ts) is the single source of truth for `PartyId`, `DistrictId`, `PollEntry`, and the algorithm I/O types. Adding a new party means adding its `PartyId` here and an entry in [src/lib/data/parties.ts](src/lib/data/parties.ts); the algorithm picks it up automatically because it iterates whatever appears in the district breakdowns.
