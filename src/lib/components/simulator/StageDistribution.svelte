<script lang="ts">
  import type { Lang } from '$i18n/dict';
  import type { FirstDistributionDistrictTrace } from '$data/types';
  import { getParty } from '$data/parties';
  import { getDistrict } from '$data/districts';
  import { partyColour } from '$lib/theme/a11y.svelte';

  type Props = {
    trace: FirstDistributionDistrictTrace;
    lang: Lang;
  };
  let { trace, lang }: Props = $props();

  const localeForNumbers = $derived(lang === 'el' ? 'el-CY' : 'en-CY');
  const numFmt = $derived(new Intl.NumberFormat(localeForNumbers));

  const district = $derived(getDistrict(trace.districtId));
  const districtName = $derived(
    district.name[lang] ?? district.name.en
  );

  // Bar chart max - the larger of (quota × 1.5) or (top-party votes × 1.05),
  // so the quota line always lands inside the chart and the biggest party
  // never overflows.
  const maxVotes = $derived(
    Math.max(
      trace.quota * 1.5,
      ...trace.perParty.map((p) => p.votes),
      1
    )
  );

  // Only show parties with > 0 votes (sub-threshold filler parties are noise
  // in this view; they're better captured in the stage-2 exclusion list).
  const rows = $derived(trace.perParty.filter((p) => p.votes > 0));

  const txt = $derived({
    quota: lang === 'el' ? 'Εκλογικό μέτρο' : 'Electoral quota',
    seatsAllocated:
      lang === 'el' ? 'Έδρες 1ης φάσης' : 'Stage-1 seats',
    seatsRemaining:
      lang === 'el' ? 'Υπόλοιπες' : 'Remaining',
    validVotes: lang === 'el' ? 'Έγκυρες ψήφοι' : 'Valid votes',
    seats: lang === 'el' ? 'έδρες' : 'seats',
    unused: lang === 'el' ? 'αχρ.' : 'unused'
  });
</script>

<article class="card" aria-label={districtName}>
  <header class="head">
    <div>
      <h4 class="title">{districtName}</h4>
      <p class="seats-meta">
        <span class="num">{trace.totalSeats}</span>
        <span class="muted">{txt.seats}</span>
      </p>
    </div>
    <dl class="meta">
      <div>
        <dt>{txt.quota}</dt>
        <dd>{numFmt.format(trace.quota)}</dd>
      </div>
      <div>
        <dt>{txt.validVotes}</dt>
        <dd>{numFmt.format(trace.validVotes)}</dd>
      </div>
    </dl>
  </header>

  <ul class="rows" role="list">
    {#each rows as row (row.partyId)}
      {@const party = getParty(row.partyId)}
      {@const width = (row.votes / maxVotes) * 100}
      {@const quotaX = (trace.quota / maxVotes) * 100}
      <li class="row">
        <div class="row-head">
          <span
            class="swatch"
            style:background-color={partyColour(party.id)}
            aria-hidden="true"
          ></span>
          <span class="row-name" title={party.name[lang] ?? party.name.en}>
            {party.shortName[lang] ?? party.shortName.en}
          </span>
          <span class="row-seats">
            <span class="num">{row.seatsWon}</span>
            <span class="muted">{txt.seats}</span>
          </span>
        </div>
        <div class="bar-wrap" aria-hidden="true">
          <div
            class="bar"
            style:width="{width}%"
            style:background-color={partyColour(party.id)}
          ></div>
          <div class="quota-line" style:left="{quotaX}%" aria-hidden="true"></div>
        </div>
        <div class="row-foot">
          <span class="row-votes">{numFmt.format(row.votes)} {lang === 'el' ? 'ψήφοι' : 'votes'}</span>
          <span class="row-unused">{numFmt.format(row.unusedVotes)} {txt.unused}</span>
        </div>
      </li>
    {/each}
  </ul>

  <footer class="foot">
    <span>
      <strong>{trace.seatsAllocated}</strong> / {trace.totalSeats} {txt.seatsAllocated.toLowerCase()}
    </span>
    {#if trace.seatsRemaining > 0}
      <span class="muted">
        {trace.seatsRemaining} {txt.seatsRemaining.toLowerCase()}
      </span>
    {/if}
  </footer>
</article>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    padding: var(--sp-4) var(--sp-4) var(--sp-3);
    background: var(--color-paper-2);
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
  .title {
    font-family: var(--font-display);
    font-size: var(--fs-300);
    margin: 0;
    color: var(--color-ink);
  }
  .seats-meta {
    margin: 2px 0 0;
    font-size: var(--fs-75);
  }
  .meta {
    display: flex;
    gap: var(--sp-3);
    margin: 0;
    font-size: var(--fs-50);
    text-align: right;
  }
  .meta dt {
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
  }
  .meta dd {
    margin: 0;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    color: var(--color-ink);
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
  .row-seats {
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
    height: 8px;
    background: var(--color-paper-3);
    border-radius: var(--radius-pill);
    overflow: visible;
  }
  .bar {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: var(--radius-pill);
    transition: width var(--dur-base) var(--ease-standard);
  }
  .quota-line {
    position: absolute;
    top: -3px;
    bottom: -3px;
    width: 2px;
    background: var(--color-ink);
    opacity: 0.6;
  }

  .row-foot {
    display: flex;
    justify-content: space-between;
    font-size: var(--fs-50);
    color: var(--color-ink-3);
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }

  .foot {
    display: flex;
    justify-content: space-between;
    padding-top: var(--sp-2);
    border-top: 1px solid var(--color-rule);
    font-size: var(--fs-75);
    color: var(--color-ink-2);
  }

  .num {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: var(--color-ink);
  }
  .muted { color: var(--color-ink-3); }
</style>
