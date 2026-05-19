<script lang="ts">
  import type { Lang, PartyId } from '$data/types';
  import { getParty } from '$data/parties';
  import { localizedName } from '$i18n/dict';

  type Props = {
    lang: Lang;
  };
  let { lang }: Props = $props();

  type Row = {
    partyId: PartyId;
    firstDist: number;
    reallocated: number;
  };

  const ROWS: Row[] = [
    { partyId: 'DISY', firstDist: 5, reallocated: 0 },
    { partyId: 'AKEL', firstDist: 4, reallocated: 2 },
    { partyId: 'DIKO', firstDist: 2, reallocated: 1 },
    { partyId: 'KOSP', firstDist: 1, reallocated: 1 },
    { partyId: 'DIPA', firstDist: 1, reallocated: 1 },
    { partyId: 'EDEK', firstDist: 1, reallocated: 0 },
    { partyId: 'ELAM', firstDist: 1, reallocated: 0 }
  ];

  const computed = $derived(
    ROWS.map((r) => ({ ...r, final: r.firstDist + r.reallocated }))
  );

  const totals = $derived({
    firstDist: computed.reduce((s, r) => s + r.firstDist, 0),
    reallocated: computed.reduce((s, r) => s + r.reallocated, 0),
    final: computed.reduce((s, r) => s + r.final, 0)
  });

  const maxFinal = $derived(Math.max(...computed.map((r) => r.final), 1));

  const L = $derived({
    title: lang === 'el' ? 'Λευκωσία 2021' : 'Nicosia 2021',
    seats: lang === 'el' ? 'έδρες' : 'seats',
    eyebrow:
      lang === 'el'
        ? 'Τελικό αποτέλεσμα'
        : 'Final outcome',
    firstDist: lang === 'el' ? '1η φάση' : 'Stage 1',
    reallocated: lang === 'el' ? 'Εθνική δεξαμενή' : 'National pool',
    final: lang === 'el' ? 'Σύνολο' : 'Total',
    total: lang === 'el' ? 'Σύνολο' : 'Total',
    note:
      lang === 'el'
        ? 'Πέντε από τις 20 έδρες της Λευκωσίας έμειναν ανοιχτές μετά την 1η φάση και αποδόθηκαν από την εθνική δεξαμενή. Δύο προσγειώθηκαν στο ΑΚΕΛ — είχε τις περισσότερες αχρ. ψήφους εκεί.'
        : 'Five of Nicosia\'s 20 seats remained unfilled after stage 1 and were assigned from the national pool. Two landed with AKEL — it had the largest unused-vote pile in the district.'
  });
</script>

<article class="card" aria-label={L.title}>
  <header class="head">
    <div>
      <p class="eyebrow">{L.eyebrow}</p>
      <h4 class="title">{L.title}</h4>
    </div>
    <p class="seats-meta">
      <span class="num">{totals.final}</span>
      <span class="muted">{L.seats}</span>
    </p>
  </header>

  <ul class="rows" role="list">
    {#each computed as r (r.partyId)}
      {@const p = getParty(r.partyId)}
      {@const firstW = (r.firstDist / maxFinal) * 100}
      {@const reallocW = (r.reallocated / maxFinal) * 100}
      <li class="row" class:row--gain={r.reallocated > 0}>
        <div class="row-head">
          <span class="swatch" style:background-color={p.colour} aria-hidden="true"></span>
          <span class="row-name">{localizedName(p.shortName, lang)}</span>
          <span class="row-final">
            <span class="num">{r.final}</span>
            {#if r.reallocated > 0}
              <span class="gain">+{r.reallocated}</span>
            {/if}
          </span>
        </div>
        <div class="bar-wrap" aria-hidden="true">
          <div class="bar bar--first" style:width="{firstW}%" style:background-color={p.colour}></div>
          <div class="bar bar--realloc" style:width="{reallocW}%" style:left="{firstW}%" style:background-color={p.colour}></div>
        </div>
        <div class="row-foot">
          <span>
            {r.firstDist} {L.firstDist.toLowerCase()}
            {#if r.reallocated > 0}
              · <span class="gain">+{r.reallocated} {L.reallocated.toLowerCase()}</span>
            {/if}
          </span>
          <span class="muted">= {r.final} {L.seats}</span>
        </div>
      </li>
    {/each}
  </ul>

  <footer class="foot">
    <span><strong>{totals.firstDist}</strong> {L.firstDist.toLowerCase()}</span>
    <span class="gain"><strong>+{totals.reallocated}</strong> {L.reallocated.toLowerCase()}</span>
    <span><strong>{totals.final}</strong> {L.total.toLowerCase()}</span>
  </footer>

  <p class="note">{L.note}</p>
</article>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    padding: var(--sp-4) var(--sp-4) var(--sp-3);
    background: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: var(--sp-7);
    height: 2px;
    background: var(--color-accent);
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--sp-3);
  }
  .eyebrow {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-accent);
    font-weight: 700;
  }
  .title {
    margin: 2px 0 0;
    font-family: var(--font-display);
    font-size: var(--fs-300);
    color: var(--color-ink);
  }
  .seats-meta {
    margin: 0;
    font-size: var(--fs-75);
    text-align: right;
  }

  .rows {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--sp-2);
  }
  .row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .row-head {
    display: grid;
    grid-template-columns: 12px minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--sp-2);
    font-size: var(--fs-75);
  }
  .row-name {
    color: var(--color-ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .row-final {
    display: inline-flex;
    align-items: baseline;
    gap: var(--sp-1);
    font-size: var(--fs-50);
    color: var(--color-ink-3);
  }
  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .bar-wrap {
    position: relative;
    height: 10px;
    background: var(--color-paper-3);
    border-radius: var(--radius-pill);
    overflow: hidden;
  }
  .bar {
    position: absolute;
    top: 0;
    bottom: 0;
    transition: width var(--dur-base) var(--ease-standard);
  }
  .bar--first {
    left: 0;
    opacity: 0.55;
  }
  .bar--realloc {
    opacity: 1;
    box-shadow: inset 1px 0 0 var(--color-paper);
  }
  .row--gain .bar--realloc {
    outline: 1.5px solid var(--color-accent);
    outline-offset: -1.5px;
  }

  .row-foot {
    display: flex;
    justify-content: space-between;
    font-size: var(--fs-50);
    color: var(--color-ink-3);
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }

  .gain {
    color: var(--color-accent);
    font-weight: 600;
  }

  .foot {
    display: flex;
    justify-content: space-between;
    padding-top: var(--sp-2);
    border-top: 1px solid var(--color-rule);
    font-size: var(--fs-75);
    color: var(--color-ink-2);
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }

  .num {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: var(--color-ink);
  }
  .muted { color: var(--color-ink-3); }

  .note {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-3);
  }
</style>
