<script lang="ts">
  import type { Lang } from '$i18n/dict';
  import type {
    PartyId,
    SecondDistributionTrace
  } from '$data/types';
  import { getParty } from '$data/parties';
  import { THRESHOLDS } from '$data/thresholds';
  import { partyColour } from '$lib/theme/a11y.svelte';

  type Props = {
    trace: SecondDistributionTrace;
    lang: Lang;
    // Lookup: party id -> national vote share % (used for the threshold view).
    nationalShare: Map<PartyId, number>;
  };
  let { trace, lang, nationalShare }: Props = $props();

  const localeForNumbers = $derived(lang === 'el' ? 'el-CY' : 'en-CY');
  const numFmt = $derived(new Intl.NumberFormat(localeForNumbers));
  const pctFmt = $derived(
    new Intl.NumberFormat(localeForNumbers, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    })
  );

  // Max share for the threshold bar - at least the largest party, with a tiny
  // headroom so the highest bar doesn't kiss the edge.
  const maxShare = $derived(
    Math.max(
      30,
      ...Array.from(nationalShare.values())
    ) * 1.05
  );

  const txt = $derived({
    threshold:
      lang === 'el'
        ? 'Όριο 3,6% · εθνικό μερίδιο'
        : '3.6 % threshold · national share',
    qualifying:
      lang === 'el' ? 'Κόμματα που πέρασαν' : 'Parties that qualified',
    excluded:
      lang === 'el' ? 'Αποκλεισμένα κάτω από 3,6%' : 'Below the 3.6 % bar',
    quota: lang === 'el' ? 'Μέτρο 2ης κατανομής' : 'Stage-2 quota',
    seatsRemaining:
      lang === 'el'
        ? 'Έδρες προς κατανομή'
        : 'Seats left for the national pool',
    totalUnused:
      lang === 'el' ? 'Σύνολο αχρ. ψήφων' : 'Total unused votes',
    seats: lang === 'el' ? 'έδρες' : 'seats',
    unused: lang === 'el' ? 'Αχρ. ψήφοι' : 'Unused votes',
    seatsWon: lang === 'el' ? 'Νέες έδρες' : 'Seats won here',
    none:
      lang === 'el'
        ? 'Κανένα κόμμα δεν αποκλείστηκε.'
        : 'No party fell below the threshold.'
  });

  const thresholdPct = THRESHOLDS.singleParty;

  // Sort excluded by share desc for readability.
  const excludedSorted = $derived(
    [...trace.excludedBelowThreshold].sort(
      (a, b) => b.nationalShare - a.nationalShare
    )
  );

  // All parties (qualified + excluded) ordered by share desc, for the threshold view.
  const thresholdRows = $derived.by(() => {
    const ids = new Set<PartyId>();
    for (const id of trace.qualifyingParties) ids.add(id);
    for (const x of trace.excludedBelowThreshold) ids.add(x.partyId);
    return Array.from(ids)
      .map((id) => ({
        partyId: id,
        share: nationalShare.get(id) ?? 0,
        qualifies: trace.qualifyingParties.includes(id)
      }))
      .sort((a, b) => b.share - a.share);
  });
</script>

<section class="wrap">
  <!-- ---- Threshold view ---- -->
  <div class="block">
    <header class="block-head">
      <h4>{txt.threshold}</h4>
    </header>

    <ul class="threshold-rows" role="list">
      {#each thresholdRows as row (row.partyId)}
        {@const party = getParty(row.partyId)}
        {@const width = Math.min(100, (row.share / maxShare) * 100)}
        {@const thresholdX = Math.min(100, (thresholdPct / maxShare) * 100)}
        <li class="row" class:excluded={!row.qualifies}>
          <span class="row-name">
            <span
              class="swatch"
              style:background-color={row.qualifies
                ? partyColour(party.id)
                : 'var(--color-rule-strong)'}
              aria-hidden="true"
            ></span>
            <span>{party.shortName[lang] ?? party.shortName.en}</span>
          </span>
          <div class="bar-wrap" aria-hidden="true">
            <div
              class="bar"
              style:width="{width}%"
              style:background-color={row.qualifies
                ? partyColour(party.id)
                : 'var(--color-rule-strong)'}
            ></div>
            <div
              class="threshold-line"
              style:left="{thresholdX}%"
              aria-hidden="true"
            ></div>
          </div>
          <span class="row-val">{pctFmt.format(row.share)}%</span>
        </li>
      {/each}
    </ul>

    {#if excludedSorted.length === 0}
      <p class="muted small">{txt.none}</p>
    {/if}
  </div>

  <!-- ---- Stage 2 allocation ---- -->
  <div class="block">
    <header class="block-head">
      <h4>{txt.qualifying}</h4>
      <dl class="kvs">
        <div>
          <dt>{txt.totalUnused}</dt>
          <dd>{numFmt.format(trace.totalUnusedVotes)}</dd>
        </div>
        <div>
          <dt>{txt.seatsRemaining}</dt>
          <dd>{trace.seatsRemaining}</dd>
        </div>
        <div>
          <dt>{txt.quota}</dt>
          <dd>{numFmt.format(trace.quota)}</dd>
        </div>
      </dl>
    </header>

    <table class="alloc">
      <thead>
        <tr>
          <th>{lang === 'el' ? 'Κόμμα' : 'Party'}</th>
          <th class="num-col">{txt.unused}</th>
          <th class="num-col">{txt.seatsWon}</th>
        </tr>
      </thead>
      <tbody>
        {#each trace.perParty as row (row.partyId)}
          {@const party = getParty(row.partyId)}
          <tr>
            <td>
              <span class="swatch sw-sm" style:background-color={partyColour(party.id)} aria-hidden="true"></span>
              <span>{party.shortName[lang] ?? party.shortName.en}</span>
            </td>
            <td class="num-col">{numFmt.format(row.unusedVotes)}</td>
            <td class="num-col"><strong>{row.seatsWon}</strong></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<style>
  .wrap {
    display: grid;
    gap: var(--sp-5);
    grid-template-columns: 1fr;
  }
  @media (min-width: 900px) {
    .wrap {
      grid-template-columns: 1.1fr 1fr;
    }
  }

  .block {
    padding: var(--sp-4) var(--sp-5);
    background: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
  }
  .block-head {
    margin-bottom: var(--sp-3);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--sp-3);
    flex-wrap: wrap;
  }
  .block-head h4 {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--fs-300);
    color: var(--color-ink);
  }

  .kvs {
    display: flex;
    gap: var(--sp-4);
    margin: 0;
    font-size: var(--fs-50);
  }
  .kvs dt {
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
  }
  .kvs dd {
    margin: 0;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    color: var(--color-ink);
  }

  .threshold-rows {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--sp-2);
  }
  .row {
    display: grid;
    grid-template-columns: minmax(7ch, 14ch) 1fr 5ch;
    align-items: center;
    gap: var(--sp-3);
  }
  .row.excluded { opacity: 0.55; }
  .row.excluded .row-name span:nth-child(2) {
    text-decoration: line-through;
    color: var(--color-ink-3);
  }

  .row-name {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    font-size: var(--fs-75);
    color: var(--color-ink);
  }
  .row-val {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-size: var(--fs-75);
    color: var(--color-ink-2);
    text-align: right;
  }
  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }
  .sw-sm { width: 8px; height: 8px; display: inline-block; margin-right: 6px; vertical-align: baseline; }

  .bar-wrap {
    position: relative;
    height: 8px;
    background: var(--color-paper-3);
    border-radius: var(--radius-pill);
  }
  .bar {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: var(--radius-pill);
    transition: width var(--dur-base) var(--ease-standard);
  }
  .threshold-line {
    position: absolute;
    top: -3px;
    bottom: -3px;
    width: 2px;
    background: var(--color-fact);
  }

  .alloc {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--fs-75);
  }
  .alloc th,
  .alloc td {
    padding: var(--sp-2) var(--sp-3);
    border-bottom: 1px solid var(--color-rule);
    text-align: left;
  }
  .alloc th {
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    font-weight: 600;
  }
  .num-col {
    text-align: right;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }
  .small { font-size: var(--fs-75); margin: 0; }
  .muted { color: var(--color-ink-3); }
</style>
