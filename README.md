# Cyprus Parliamentary Elections 2026

A static, bilingual (English / Greek) explainer and seat-allocation simulator for the **24 May 2026 Cypriot parliamentary election**. The site renders the electoral system as runnable code: a step-by-step worked example from 2021, a live simulator that takes national vote shares and produces a seat outcome, and a tracker of published polls.

Built with SvelteKit 5 (runes) + TypeScript. No backend, no analytics, no cookies. The entire seat-allocation algorithm runs in the browser.

## Quick start

```bash
npm install
npm run dev         # local dev server
npm run check       # svelte-check + TypeScript
npm test            # vitest
npm run build       # static production build → ./build
npm run preview     # serve the production build
```

## The seat calculator (the engine)

Cyprus uses what Greek-Cypriot election law calls *ενισχυμένη αναλογική* — "reinforced proportional representation". It is a three-stage seat-allocation procedure: a per-district Hare quota, then a national pool above a 3.6 % threshold, then a residual pool above a 7.2 % threshold. The whole thing is implemented as one pure, deterministic function in [`src/lib/election-algorithm.ts`](src/lib/election-algorithm.ts):

```ts
allocateSeats(input, districtSeats, thresholds): AllocationResult
```

District seat counts and thresholds are **inputs**, not constants — the same routine reproduces 2021 (Nicosia 20, Paphos 4) and runs 2026 (Nicosia 19, Paphos 5).

### Stage 1 — First distribution (per district)

For each of the six districts:

1. Compute the **electoral quota** (`μέτρο`) as `floor(valid_votes / district_seats)`.
2. Each party wins `floor(party_votes / quota)` seats.
3. Whatever is left over is the party's **unused votes** (`αχρησιμοποίητες ψήφοι`) in that district: `party_votes − seats_won × quota`.

Seats not filled in the first distribution carry over to the national pool. In 2021, only 29 of 56 seats were filled at this stage; the remaining 27 went to stages 2 and 3.

### Stage 2 — Second distribution (national pool, 3.6 % threshold)

All of Cyprus is now treated as a single constituency. Every qualifying party's district-level unused votes are summed into a **national unused-vote total**.

- **Eligibility** — a single party needs ≥ 3.6 % of the nationwide valid vote (2-party coalition: 10 %, 3+ party: 20 %).
- **Quota** — `floor(total_qualifying_unused / seats_remaining)`. In 2021 this was `122,668 / 27 ≈ 4,543`.
- **Seats per party** — `floor(party_national_unused / stage_2_quota)`.

### Stage 3 — Residual distribution (7.2 % threshold)

Any seats still unfilled go one-by-one to the qualifying party with the largest **remaining** unused votes (national unused minus what was "spent" at the stage-2 quota). The threshold here is higher: a party needs ≥ 7.2 % nationally to participate. The seat awarded "consumes" one stage-2 quota of remaining unused, so subsequent picks stay honest if the same party wins multiple residual seats.

### Re-assigning earned seats back to districts

This part is easy to get wrong, because it's the bit the system is most often described as. Per the Wikipedia / electoral-law summary of the relevant statute:

> Seats allocated in the second and third allocation are distributed to lists in constituencies by ranking the parties based on their total votes and giving the lists a seat in the constituency where it had the most unused votes in the first allocation, assuming that constituency did not have all its seats filled previously …

So national-pool seats are *earned* by national unused totals, then *placed* in the party's strongest-unused district that still has capacity. The implementation processes parties in descending national-vote order and walks each party's district list highest-unused first, decrementing seat capacity per placement.

### Output

`AllocationResult` exposes three traces — `firstDistribution[]`, `secondDistribution`, `thirdDistribution` — which the simulator UI renders verbatim. They're the source of truth for the stage-by-stage walkthroughs you see on the *Simulator* and *Worked example* pages, so changing the trace shapes is a UI-breaking change.

### Tests

[`tests/election-algorithm.test.ts`](tests/election-algorithm.test.ts) reproduces the 2021 worked example with inline fixtures. The tests deliberately do **not** import production data files so a data refactor can't silently turn a regression green.

```bash
npm test                                  # all
npx vitest run tests/election-algorithm.test.ts
npx vitest run -t "second distribution"   # by name
```

## Simulator pipeline

The interactive simulator is a thin wrapper around the engine. Its state lives in a Svelte 5 runes store ([`src/lib/simulator/state.svelte.ts`](src/lib/simulator/state.svelte.ts)):

```
nationalShares (%) ──► deriveDistrictVotes ──► allocateSeats ──► AllocationResult
                       (only approximation)    (exact)
```

- [`derive-district-votes.ts`](src/lib/simulator/derive-district-votes.ts) is the **only** approximation in the chain. It splits each party's national vote share across six districts using 2021-derived intensity coefficients (party-specific local strength relative to district population). The UI flags this as approximate; everything downstream is exact.
- A "2021 actual" preset bypasses the approximation by setting an explicit `overrideBreakdown` from [`preset-2021.ts`](src/lib/simulator/preset-2021.ts). Editing any share clears the override.

## Data

Official 2021 numbers in [`src/lib/data/results-2021.ts`](src/lib/data/results-2021.ts) are sourced from the Cyprus Ministry of Interior's polling-station-level dataset on data.gov.cy, aggregated to `election_district × party`:

- [data.gov.cy — Επίσημα Αποτελέσματα Βουλευτικών Εκλογών 2021](https://data.gov.cy/el/dataset/episima-apotelesmata-boyleytikon-eklogon-2021) (CSV / XLSX / JSON)
- [Ministry of Interior — 2021 results portal](https://results.elections.moi.gov.cy/English/PARLIAMENTARY_ELECTIONS_2021/Islandwide)

Polls live as one JSON file per poll in [`src/lib/data/polls/`](src/lib/data/polls/), named `YYYY-MM-DD-<pollster>.json` by `fieldworkEnd`. [`polls.ts`](src/lib/data/polls.ts) is a thin loader that glob-imports them with `import.meta.glob` (eager) and sorts descending. Drop a new file to add a poll — no other wiring.

The canonical research notes for the algorithm and the wider 2026 context are in [`research/compass_artifact_wf-*.md`](research/). Read it before changing seat-allocation logic or domain types.

## Repository layout

```
src/
├── lib/
│   ├── election-algorithm.ts            # ← the engine (pure, deterministic)
│   ├── simulator/
│   │   ├── state.svelte.ts              # runes-based store
│   │   ├── derive-district-votes.ts     # the only approximation
│   │   └── preset-2021.ts               # "2021 actual" override
│   ├── data/
│   │   ├── types.ts                     # PartyId / DistrictId / I/O types
│   │   ├── parties.ts, districts.ts     # static reference data
│   │   ├── results-2021.ts              # official MOI 2021 figures
│   │   ├── polls/                       # one JSON per poll
│   │   └── polls.ts                     # glob loader
│   ├── components/
│   │   ├── walkthrough/                 # worked-example panels
│   │   ├── charts/                      # poll tracker, legends
│   │   ├── simulator/                   # stage UIs
│   │   └── …
│   └── i18n/dict.ts                     # flat EN/EL dictionary
├── routes/
│   ├── +page.svelte                     # language picker
│   └── [lang=lang]/                     # all real content (matched to en|el)
│       ├── system/                      # algorithm explainer
│       ├── worked-example/              # step-by-step 2021 walkthrough
│       ├── simulator/                   # live simulator
│       ├── polls/                       # poll tracker
│       ├── districts/                   # district map + ballots
│       ├── parties/                     # party roster
│       └── about/                       # methodology + sources
├── params/lang.ts                       # route param matcher (en|el only)
└── service-worker.ts
tests/                                   # vitest specs
research/                                # source notes for the algorithm
```

Vite aliases configured in [`svelte.config.js`](svelte.config.js): `$data` → `src/lib/data`, `$components` → `src/lib/components`, `$i18n` → `src/lib/i18n`. Use these instead of relative paths when crossing boundaries.

## Routing and i18n

- `@sveltejs/adapter-static` with `prerender = true`. Every page must be prerenderable.
- `/` is a hard-redirecting language picker; all real content lives under `/[lang]/…`.
- The `lang` route param is constrained to `en` or `el` by the matcher in [`src/params/lang.ts`](src/params/lang.ts) — anything else 404s.
- i18n is a flat dictionary in [`src/lib/i18n/dict.ts`](src/lib/i18n/dict.ts). Components receive `lang` from the layout and call `t(lang, key)` directly; no per-locale routing logic.

## Caveats

- The polls dataset mixes **raw** and **valid-vote redistributed** share bases. Each entry's `notes` field flags which. Don't normalise without checking each entry against its primary source.
- `derive-district-votes.ts` retains a fallback branch for partial per-district data. Now that 2021 data is complete in `results-2021.ts`, that branch is effectively dead code.
- The site is independent and unaffiliated with the Republic of Cyprus, the Ministry of Interior, or any political party.
