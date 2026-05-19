<script lang="ts">
  import type { Lang, PartyId } from '$data/types';
  import { getParty } from '$data/parties';
  import { localizedName } from '$i18n/dict';
  import { partyColour } from '$lib/theme/a11y.svelte';

  type Props = {
    lang: Lang;
  };

  let { lang }: Props = $props();

  // Pre-computed Nicosia 2021 unused-vote tallies (quota = 6,117). Source: §1.7.
  type Row = { partyId: PartyId; unused: number };

  const RAW: Row[] = [
    { partyId: 'DISY', unused: 578 },
    { partyId: 'AKEL', unused: 1302 },
    { partyId: 'DIKO', unused: 1215 },
    { partyId: 'EDEK', unused: 2944 },
    { partyId: 'KOSP', unused: 2269 },
    { partyId: 'DIPA', unused: 2115 },
    { partyId: 'ELAM', unused: 1369 }
  ];

  // Sort descending - biggest unused first.
  const sorted = $derived([...RAW].sort((a, b) => b.unused - a.unused));
  const maxUnused = $derived(Math.max(...sorted.map((r) => r.unused)));

  function fmt(n: number): string {
    return new Intl.NumberFormat(lang === 'el' ? 'el-CY' : 'en-GB').format(n);
  }

  const L = $derived({
    eyebrow:
      lang === 'el'
        ? 'Νicosia 2021 · Αχρησιμοποίητες ψήφοι'
        : 'Nicosia 2021 · unused votes',
    title:
      lang === 'el'
        ? 'Αυτές οι ψήφοι μπαίνουν στην εθνική δεξαμενή'
        : 'These votes feed the national pool',
    callout:
      lang === 'el'
        ? 'Το ΑΚΕΛ είχε τις περισσότερες αχρησιμοποίητες ψήφους στη Λευκωσία (1.302) και έλαβε μία επιπλέον έδρα στη Λευκωσία μέσω της εθνικής αναδιανομής.'
        : 'AKEL had the most unused votes in Nicosia (1,302) and was reallocated an extra Nicosia seat via the national pool.',
    sortNote:
      lang === 'el'
        ? 'Ταξινόμηση κατά αχρησιμοποίητες ψήφοι, φθίνουσα.'
        : 'Sorted by unused votes, descending.'
  });

  // Highlight the largest bar (AKEL in this dataset)
  const topId = $derived(sorted[0]?.partyId);
</script>

<section class="bars-panel" aria-labelledby="realloc-title">
  <header class="bp-header">
    <p class="bp-eyebrow">{L.eyebrow}</p>
    <h4 id="realloc-title" class="bp-title">{L.title}</h4>
  </header>

  <ul class="bars" role="list">
    {#each sorted as r (r.partyId)}
      {@const p = getParty(r.partyId)}
      {@const pct = (r.unused / maxUnused) * 100}
      {@const isTop = r.partyId === topId}
      <li class="bar-row" class:bar-row--top={isTop}>
        <span class="bar-label">
          <span class="bar-swatch" style="background-color: {partyColour(p.id)};" aria-hidden="true"></span>
          {localizedName(p.shortName, lang)}
        </span>
        <span
          class="bar-track"
          role="img"
          aria-label={`${localizedName(p.shortName, lang)}: ${fmt(r.unused)}`}
        >
          <span
            class="bar-fill"
            style="width: {pct.toFixed(2)}%; background-color: {partyColour(p.id)};"
          ></span>
        </span>
        <span class="bar-value">{fmt(r.unused)}</span>
      </li>
    {/each}
  </ul>

  <p class="bp-caption">{L.sortNote}</p>

  <div class="bp-callout" role="note">
    <p>{L.callout}</p>
  </div>
</section>

<style>
  .bars-panel {
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    padding: var(--sp-5);
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .bp-eyebrow {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-fact);
    font-weight: 700;
  }

  .bp-title {
    margin: var(--sp-1) 0 0;
    font-family: var(--font-display);
    font-size: var(--fs-300);
    font-weight: 600;
    line-height: var(--lh-tight);
    color: var(--color-ink);
    text-wrap: balance;
  }

  .bars {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  .bar-row {
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr) 64px;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-1) 0;
  }

  @media (max-width: 480px) {
    .bar-row {
      grid-template-columns: 72px minmax(0, 1fr) 56px;
      gap: var(--sp-2);
    }
  }

  .bar-label {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    color: var(--color-ink);
    font-weight: 600;
    min-width: 0;
  }

  .bar-swatch {
    width: 10px;
    height: 10px;
    border-radius: var(--radius-1);
    border: 1px solid rgba(20, 24, 31, 0.18);
    flex-shrink: 0;
  }

  .bar-track {
    display: block;
    height: 18px;
    background-color: var(--color-paper-3);
    border-radius: var(--radius-1);
    position: relative;
    overflow: hidden;
  }

  .bar-fill {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: var(--radius-1);
    transition: width var(--dur-base) var(--ease-standard);
  }

  .bar-value {
    text-align: right;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-size: var(--fs-75);
    color: var(--color-ink);
    font-weight: 600;
  }

  .bar-row--top .bar-value {
    color: var(--color-fact);
  }

  .bar-row--top .bar-track {
    box-shadow: inset 0 0 0 1px var(--color-fact);
  }

  .bp-caption {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    color: var(--color-ink-3);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
  }

  .bp-callout {
    margin: 0;
    padding: var(--sp-3) var(--sp-4);
    background-color: var(--color-fact-soft);
    border-left: 3px solid var(--color-fact);
    border-radius: var(--radius-2);
  }

  .bp-callout p {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
  }

  .bp-callout :global(strong) {
    color: var(--color-ink);
  }
</style>
