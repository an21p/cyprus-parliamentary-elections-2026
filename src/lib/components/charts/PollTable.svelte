<script lang="ts">
  import type { Lang, PartyId, PollEntry } from '$data/types';
  import { POLLS } from '$data/polls';
  import { getParty } from '$data/parties';
  import { localizedName } from '$i18n/dict';
  import { chartPartyColour } from '$lib/theme/a11y.svelte';

  type Props = {
    lang: Lang;
    data?: PollEntry[];
    /** Columns to show, in order. Defaults to all major parties. */
    parties?: PartyId[];
  };

  // Shared "major eight" used by both poll graphs (tracker + table/bars).
  const DEFAULT_PARTIES: PartyId[] = [
    'DISY',
    'AKEL',
    'ELAM',
    'DIKO',
    'ADK',
    'ALMA',
    'VOLT',
    'EDEK'
  ];

  let { lang, data = POLLS, parties = DEFAULT_PARTIES }: Props = $props();

  // Pollsters are identified by name; the swatch is a neutral grey across
  // the page (filter chips, table cell, bars info-cube, details dialog).
  const POLLSTER_SWATCH = 'var(--color-ink-3)';

  const pollsterCounts = $derived.by<Map<string, number>>(() => {
    const counts = new Map<string, number>();
    for (const p of data) counts.set(p.pollster, (counts.get(p.pollster) ?? 0) + 1);
    return counts;
  });

  const uniquePollsters = $derived.by<string[]>(() => {
    return Array.from(pollsterCounts.keys()).sort((a, b) => a.localeCompare(b));
  });

  // Filter state - every pollster active by default.
  let activePollsters = $state<string[]>([]);
  $effect(() => {
    activePollsters = [...uniquePollsters];
  });

  function togglePollster(name: string) {
    if (activePollsters.includes(name)) {
      activePollsters = activePollsters.filter((x) => x !== name);
    } else {
      activePollsters = [...activePollsters, name];
    }
  }
  function selectAllPollsters() {
    activePollsters = [...uniquePollsters];
  }
  function clearPollsters() {
    activePollsters = [];
  }

  // ----- Sort state -----------------------------------------------------
  type SortKey =
    | 'date'
    | 'pollster'
    | 'commissioner'
    | 'sample'
    | 'moe'
    | PartyId;
  type SortDir = 'asc' | 'desc';

  let sortKey = $state<SortKey>('date');
  let sortDir = $state<SortDir>('desc');

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      // sensible defaults: dates and numbers descending, text ascending
      sortDir =
        key === 'pollster' || key === 'commissioner' ? 'asc' : 'desc';
    }
  }

  function sortValue(p: PollEntry, key: SortKey): number | string | null {
    switch (key) {
      case 'date':
        return new Date(p.fieldworkEnd).getTime();
      case 'pollster':
        return p.pollster.toLowerCase();
      case 'commissioner':
        return p.commissioner.toLowerCase();
      case 'sample':
        return p.sample ?? -Infinity;
      case 'moe':
        return p.marginOfError ?? -Infinity;
      default:
        return p.shares[key] ?? -Infinity;
    }
  }

  const rows = $derived(
    data
      .filter((p) => activePollsters.includes(p.pollster))
      .sort((a, b) => {
        const av = sortValue(a, sortKey);
        const bv = sortValue(b, sortKey);
        const dir = sortDir === 'asc' ? 1 : -1;
        if (av === null && bv === null) return 0;
        if (av === null) return 1;
        if (bv === null) return -1;
        if (typeof av === 'number' && typeof bv === 'number') {
          return (av - bv) * dir;
        }
        return String(av).localeCompare(String(bv)) * dir;
      })
  );

  function fmtDate(iso: string): string {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  }

  function fmtRange(p: PollEntry): string {
    if (p.fieldworkStart === p.fieldworkEnd) return fmtDate(p.fieldworkEnd);
    return `${fmtDate(p.fieldworkStart)} – ${fmtDate(p.fieldworkEnd)}`;
  }

  function fmtShare(v: number | undefined): string {
    return typeof v === 'number' ? v.toFixed(1) : '-';
  }

  function fmtSample(v: number | null): string {
    return v === null ? '-' : new Intl.NumberFormat(lang === 'el' ? 'el-CY' : 'en-GB').format(v);
  }

  function fmtMoE(v: number | null): string {
    return v === null ? '-' : `±${v.toFixed(1)}`;
  }

  function ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (sortKey !== key) return 'none';
    return sortDir === 'asc' ? 'ascending' : 'descending';
  }

  function sortIndicator(key: SortKey): string {
    if (sortKey !== key) return '';
    return sortDir === 'asc' ? '↑' : '↓';
  }

  // Labels
  const L = $derived({
    caption:
      lang === 'el'
        ? 'Δημοσκοπήσεις 2024–2026 για τις βουλευτικές εκλογές Κύπρου'
        : 'Polls 2024–2026 for the Cyprus parliamentary elections',
    date: lang === 'el' ? 'Πεδίο' : 'Fieldwork',
    pollster: lang === 'el' ? 'Εταιρεία' : 'Pollster',
    commissioner: lang === 'el' ? 'Ανάθεση' : 'Commissioned by',
    sample: lang === 'el' ? 'Δείγμα' : 'Sample',
    moe: lang === 'el' ? 'Σφάλμα' : 'MoE',
    sortBy: lang === 'el' ? 'Ταξινόμηση' : 'Sort by',
    filterTitle: lang === 'el' ? 'Φίλτρο εταιρειών' : 'Filter pollsters',
    selectAll: lang === 'el' ? 'Όλες' : 'All',
    clear: lang === 'el' ? 'Καμία' : 'None',
    empty:
      lang === 'el'
        ? 'Δεν επιλέχθηκε καμία εταιρεία.'
        : 'No pollster selected.',
    viewLabel: lang === 'el' ? 'Προβολή' : 'View',
    viewTable: lang === 'el' ? 'Πίνακας' : 'Table',
    viewBars: lang === 'el' ? 'Μπάρες' : 'Bars',
    detailsTitle: lang === 'el' ? 'Στοιχεία δημοσκόπησης' : 'Poll details',
    notes: lang === 'el' ? 'Σημειώσεις' : 'Notes',
    close: lang === 'el' ? 'Κλείσιμο' : 'Close',
    openDetailsAria: lang === 'el' ? 'Στοιχεία' : 'Details',
    other: lang === 'el' ? 'Λοιπά / αναποφάσιστοι' : 'Other / undecided',
    legend: lang === 'el' ? 'Κόμματα' : 'Parties'
  });

  // ----- View mode (table | bars) ---------------------------------------
  type ViewMode = 'table' | 'bars';
  let viewMode = $state<ViewMode>('bars');

  // ----- Popup anchor positioning ---------------------------------------
  type AnchorRect = { top: number; left: number; width: number };

  function anchorRect(el: Element): AnchorRect {
    const r = el.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width };
  }

  // ----- Details popup --------------------------------------------------
  let activeRow = $state<PollEntry | null>(null);
  let detailsAnchor = $state<AnchorRect | null>(null);

  function openDetails(ev: MouseEvent, row: PollEntry) {
    activeRow = row;
    detailsAnchor = anchorRect(ev.currentTarget as Element);
  }
  function closeDetails() {
    activeRow = null;
    detailsAnchor = null;
  }

  // ----- Party card popup (bars view) -----------------------------------
  let activePartyCard = $state<{
    partyId: PartyId;
    share: number;
    poll: PollEntry;
  } | null>(null);
  let partyCardAnchor = $state<AnchorRect | null>(null);

  function openPartyCard(ev: MouseEvent, partyId: PartyId, share: number, poll: PollEntry) {
    activePartyCard = { partyId, share, poll };
    partyCardAnchor = anchorRect(ev.currentTarget as Element);
  }
  function closePartyCard() {
    activePartyCard = null;
    partyCardAnchor = null;
  }

  function onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      closePartyCard();
      closeDetails();
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="poll-toolbar">
  <div class="poll-filter" role="group" aria-label={L.filterTitle}>
    <div class="poll-filter-head">
      <p class="poll-filter-title">{L.filterTitle}</p>
      <div class="poll-filter-actions">
        <button type="button" class="ghost-btn" onclick={selectAllPollsters}>{L.selectAll}</button>
        <span class="dot" aria-hidden="true">·</span>
        <button type="button" class="ghost-btn" onclick={clearPollsters}>{L.clear}</button>
      </div>
    </div>
    <ul class="poll-filter-list" role="list">
      {#each uniquePollsters as name (name)}
        {@const on = activePollsters.includes(name)}
        <li>
          <button
            type="button"
            class="chip"
            class:chip--off={!on}
            aria-pressed={on}
            onclick={() => togglePollster(name)}
          >
            <span class="chip-swatch" style="background-color: {POLLSTER_SWATCH};" aria-hidden="true"></span>
            <span class="chip-label">{name}</span>
            <span class="chip-count" aria-hidden="true">{pollsterCounts.get(name)}</span>
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <div class="view-switch" role="group" aria-label={L.viewLabel}>
    <span class="view-switch-label">{L.viewLabel}</span>
    <div class="view-switch-buttons">
      <button
        type="button"
        class="view-btn"
        class:view-btn--on={viewMode === 'table'}
        aria-pressed={viewMode === 'table'}
        onclick={() => (viewMode = 'table')}
      >{L.viewTable}</button>
      <button
        type="button"
        class="view-btn"
        class:view-btn--on={viewMode === 'bars'}
        aria-pressed={viewMode === 'bars'}
        onclick={() => (viewMode = 'bars')}
      >{L.viewBars}</button>
    </div>
  </div>
</div>

<div class="party-legend" role="list" aria-label={L.legend}>
  {#each parties as id (id)}
    {@const p = getParty(id)}
    <div class="party-legend-item" role="listitem">
      <span class="party-legend-swatch" style="background-color: {chartPartyColour(id)};" aria-hidden="true"></span>
      <span class="party-legend-label">{localizedName(p.shortName, lang)}</span>
    </div>
  {/each}
</div>

{#if viewMode === 'table'}
<div class="poll-table-wrap">
  <div class="scroll">
    <table class="poll-table">
      <caption class="visually-hidden">{L.caption}</caption>
      <thead>
        <tr>
          <th
            scope="col"
            class="col-date col-frozen col-frozen-1"
            aria-sort={ariaSort('date')}
          >
            <button type="button" onclick={() => toggleSort('date')} title={L.sortBy}>
              {L.date} <span class="sort-ind" aria-hidden="true">{sortIndicator('date')}</span>
            </button>
          </th>
          <th
            scope="col"
            class="col-pollster col-frozen col-frozen-2"
            aria-sort={ariaSort('pollster')}
          >
            <button type="button" onclick={() => toggleSort('pollster')} title={L.sortBy}>
              {L.pollster} <span class="sort-ind" aria-hidden="true">{sortIndicator('pollster')}</span>
            </button>
          </th>
          <th scope="col" aria-sort={ariaSort('commissioner')}>
            <button type="button" onclick={() => toggleSort('commissioner')} title={L.sortBy}>
              {L.commissioner} <span class="sort-ind" aria-hidden="true">{sortIndicator('commissioner')}</span>
            </button>
          </th>
          <th scope="col" class="num" aria-sort={ariaSort('sample')}>
            <button type="button" onclick={() => toggleSort('sample')} title={L.sortBy}>
              {L.sample} <span class="sort-ind" aria-hidden="true">{sortIndicator('sample')}</span>
            </button>
          </th>
          <th scope="col" class="num" aria-sort={ariaSort('moe')}>
            <button type="button" onclick={() => toggleSort('moe')} title={L.sortBy}>
              {L.moe} <span class="sort-ind" aria-hidden="true">{sortIndicator('moe')}</span>
            </button>
          </th>
          {#each parties as party (party)}
            {@const p = getParty(party)}
            <th scope="col" class="num party-col" aria-sort={ariaSort(party)}>
              <button
                type="button"
                onclick={() => toggleSort(party)}
                title={L.sortBy}
                style="--party-color: {chartPartyColour(p.id)};"
              >
                <span class="party-swatch" aria-hidden="true"></span>
                {localizedName(p.shortName, lang)}
                <span class="sort-ind" aria-hidden="true">{sortIndicator(party)}</span>
              </button>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#if rows.length === 0}
          <tr>
            <td class="empty" colspan={5 + parties.length}>{L.empty}</td>
          </tr>
        {:else}
          {#each rows as row, i (i)}
            {@const colour = POLLSTER_SWATCH}
            <tr>
              <th scope="row" class="col-frozen col-frozen-1 col-date">{fmtRange(row)}</th>
              <td class="col-frozen col-frozen-2 col-pollster">
                <span class="pollster-cell">
                  <span class="pollster-swatch" style="background-color: {colour};" aria-hidden="true"></span>
                  <span>{row.pollster}</span>
                </span>
              </td>
              <td>{row.commissioner}</td>
              <td class="num">{fmtSample(row.sample)}</td>
              <td class="num">{fmtMoE(row.marginOfError)}</td>
              {#each parties as party (party)}
                <td class="num">{fmtShare(row.shares[party])}</td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
{:else}
<div class="poll-bars" role="list" aria-label={L.caption}>
  {#if rows.length === 0}
    <p class="empty empty-bars">{L.empty}</p>
  {:else}
    {#each rows as row, i (i)}
      {@const colour = POLLSTER_SWATCH}
      {@const segments = parties
        .map((id) => ({ id, value: row.shares[id] ?? 0 }))
        .filter((s) => s.value > 0)}
      {@const total = segments.reduce((s, v) => s + v.value, 0)}
      <div class="bar-row" role="listitem">
        <button
          type="button"
          class="info-cube"
          style="background-color: {colour};"
          aria-label="{L.openDetailsAria}: {row.pollster}, {fmtRange(row)}"
          title="{row.pollster} — {row.commissioner}"
          onclick={(ev) => openDetails(ev, row)}
        ></button>
        <div class="bar-meta">
          <span class="bar-date">{fmtRange(row)}</span>
          <span class="bar-pollster">{row.pollster}</span>
        </div>
        <div
          class="bar-track"
          role="img"
          aria-label={parties
            .filter((id) => (row.shares[id] ?? 0) > 0)
            .map(
              (id) =>
                `${localizedName(getParty(id).shortName, lang)} ${fmtShare(row.shares[id])}%`
            )
            .join(', ')}
        >
          {#each segments as seg (seg.id)}
            {@const p = getParty(seg.id)}
            <button
              type="button"
              class="bar-seg"
              style="width: {seg.value}%; background-color: {chartPartyColour(p.id)};"
              title="{localizedName(p.shortName, lang)} · {fmtShare(seg.value)}%"
              aria-label="{localizedName(p.shortName, lang)} {fmtShare(seg.value)}%"
              onclick={(ev) => openPartyCard(ev, seg.id, seg.value, row)}
            >
              {#if seg.value >= 6}
                <span class="bar-seg-label">{fmtShare(seg.value)}</span>
              {/if}
            </button>
          {/each}
          {#if total < 100}
            <span
              class="bar-seg bar-seg--other"
              style="width: {100 - total}%;"
              title="{L.other} · {fmtShare(100 - total)}%"
            ></span>
          {/if}
        </div>
      </div>
    {/each}
  {/if}
</div>
{/if}

{#if activePartyCard && partyCardAnchor}
  {@const party = getParty(activePartyCard.partyId)}
  {@const swatch = chartPartyColour(party.id)}
  <div
    class="popup-overlay"
    role="presentation"
    onclick={closePartyCard}
  ></div>
  <div
    class="party-card-popup"
    role="dialog"
    aria-label={lang === 'el' ? 'Στοιχεία κόμματος' : 'Party details'}
    style="--anchor-left: {partyCardAnchor.left}px; --anchor-top: {partyCardAnchor.top}px; --anchor-width: {partyCardAnchor.width}px;"
  >
    <button
      type="button"
      class="party-card-close"
      aria-label={L.close}
      onclick={closePartyCard}
    >×</button>
    <div class="party-card">
      <div class="party-card-logo" style="--party-color: {swatch};">
        {#if party.logo}
          <img src={party.logo} alt="" />
        {:else}
          <span class="party-card-swatch" aria-hidden="true"></span>
        {/if}
      </div>
      <div class="party-card-info">
        <p class="party-card-share">{fmtShare(activePartyCard.share)}<span class="party-card-share-pct">%</span></p>
        <p class="party-card-name">{localizedName(party.shortName, lang)}</p>
        <p class="party-card-name-full">{localizedName(party.name, lang)}</p>
        <p class="party-card-meta">{activePartyCard.poll.pollster} · {fmtRange(activePartyCard.poll)}</p>
      </div>
    </div>
  </div>
{/if}

{#if activeRow && detailsAnchor}
  <div
    class="popup-overlay"
    role="presentation"
    onclick={closeDetails}
  ></div>
  <div
    class="poll-info-popup"
    role="dialog"
    aria-label={L.detailsTitle}
    style="--anchor-left: {detailsAnchor.left}px; --anchor-top: {detailsAnchor.top}px; --anchor-width: {detailsAnchor.width}px;"
  >
    <header class="dialog-head">
      <span class="dialog-swatch" style="background-color: {POLLSTER_SWATCH};" aria-hidden="true"></span>
      <div>
        <h3 class="dialog-title">{activeRow.pollster}</h3>
        <p class="dialog-sub">{fmtRange(activeRow)}</p>
      </div>
      <button type="button" class="dialog-close" aria-label={L.close} onclick={closeDetails}>×</button>
    </header>
    <dl class="dialog-grid">
      <dt>{L.commissioner}</dt>
      <dd>{activeRow.commissioner}</dd>
      <dt>{L.date}</dt>
      <dd>{fmtRange(activeRow)}</dd>
      <dt>{L.sample}</dt>
      <dd>{fmtSample(activeRow.sample)}</dd>
      <dt>{L.moe}</dt>
      <dd>{fmtMoE(activeRow.marginOfError)}</dd>
      {#if activeRow.notes}
        <dt>{L.notes}</dt>
        <dd class="dialog-notes">{activeRow.notes}</dd>
      {/if}
    </dl>
  </div>
{/if}

<style>
  .party-legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-1) var(--sp-3);
    margin-bottom: var(--sp-3);
  }
  .party-legend-item {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
  }
  .party-legend-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
    border: 1px solid rgba(20, 24, 31, 0.15);
  }
  .party-legend-label {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    color: var(--color-ink-2);
    white-space: nowrap;
  }

  .poll-table-wrap {
    width: 100%;
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    overflow: hidden;
    background-color: var(--color-paper-2);
  }

  .scroll {
    overflow-x: auto;
    max-width: 100%;
  }

  .poll-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    color: var(--color-ink-2);
    min-width: 900px;
  }

  caption.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: var(--color-paper-2);
    border-bottom: 2px solid var(--color-rule-strong);
    text-align: left;
    padding: 0;
    font-weight: 600;
    color: var(--color-ink);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    white-space: nowrap;
  }

  thead th button {
    width: 100%;
    background: none;
    border: 0;
    padding: var(--sp-2) var(--sp-3);
    font: inherit;
    color: inherit;
    text-align: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
  }

  thead th button:hover {
    background-color: var(--color-paper-3);
  }

  thead th button:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  thead th.num button {
    justify-content: flex-end;
  }

  .party-swatch {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-1);
    background-color: var(--party-color);
    border: 1px solid rgba(20, 24, 31, 0.18);
    flex-shrink: 0;
  }

  tbody td,
  tbody th {
    padding: var(--sp-2) var(--sp-3);
    border-bottom: 1px solid var(--color-rule);
    white-space: nowrap;
    font-weight: 400;
    background-color: var(--color-paper);
    text-align: left;
  }

  tbody tr:last-child td,
  tbody tr:last-child th {
    border-bottom: 0;
  }

  .num {
    text-align: right;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }

  .sort-ind {
    color: var(--color-accent);
    font-family: var(--font-mono);
    width: 1ch;
    display: inline-block;
  }

  /* Frozen columns - left side */
  .col-frozen {
    position: sticky;
    background-color: var(--color-paper);
    z-index: 1;
  }
  thead .col-frozen {
    z-index: 3;
    background-color: var(--color-paper-2);
  }
  .col-frozen-1 {
    left: 0;
    border-right: 1px solid var(--color-rule);
  }
  .col-frozen-2 {
    left: 116px;
    border-right: 1px solid var(--color-rule);
  }
  .col-date {
    min-width: 116px;
    font-variant-numeric: tabular-nums;
    font-family: var(--font-mono);
  }
  .col-pollster {
    min-width: 160px;
  }

  /* Hide frozen second column on the narrowest viewports for breathing room */
  @media (max-width: 480px) {
    .col-frozen-2 {
      position: static;
      left: auto;
    }
  }

  .pollster-cell {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
  }

  .pollster-swatch {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-1);
    border: 1px solid rgba(20, 24, 31, 0.18);
    flex-shrink: 0;
  }

  .empty {
    text-align: center;
    color: var(--color-ink-3);
    padding: var(--sp-6) var(--sp-3);
    font-style: italic;
  }

  /* Pollster filter */
  .poll-filter {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    margin-bottom: var(--sp-3);
  }

  .poll-filter-head {
    display: flex;
    align-items: baseline;
    gap: var(--sp-3);
    flex-wrap: wrap;
  }

  .poll-filter-title {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    margin: 0;
  }

  .poll-filter-actions {
    display: inline-flex;
    align-items: baseline;
    gap: var(--sp-2);
  }

  .poll-filter-actions .dot {
    color: var(--color-ink-3);
  }

  .ghost-btn {
    appearance: none;
    background: none;
    border: 0;
    padding: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }

  .ghost-btn:hover {
    color: var(--color-ink);
  }

  .ghost-btn:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
    border-radius: var(--radius-1);
  }

  .poll-filter-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--sp-2);
  }

  .poll-filter-list > li {
    display: flex;
    align-items: center;
  }

  .poll-filter-list .chip {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    height: 24px;
    padding: 0 var(--sp-3);
    border-radius: var(--radius-pill);
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    line-height: 1;
    color: var(--color-ink);
    cursor: pointer;
    box-sizing: border-box;
    transition: border-color var(--dur-fast) var(--ease-standard),
      background-color var(--dur-fast) var(--ease-standard);
  }

  .poll-filter-list .chip:hover {
    border-color: var(--color-rule-strong);
  }

  .poll-filter-list .chip:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .poll-filter-list .chip--off {
    opacity: 0.4;
  }

  .poll-filter-list .chip-swatch {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: var(--radius-1);
    flex-shrink: 0;
    border: 1px solid rgba(20, 24, 31, 0.18);
  }

  .poll-filter-list .chip-label {
    font-weight: 500;
    white-space: nowrap;
  }
  .poll-filter-list .chip-count {
    font-size: var(--fs-50);
    font-weight: 600;
    color: var(--color-ink-3);
    background-color: var(--color-paper-2);
    border-radius: var(--radius-1);
    padding: 1px 5px;
    line-height: 1.4;
  }
  .poll-filter-list .chip--off .chip-count {
    opacity: 0.5;
  }

  /* Toolbar: filter (left) + view switch (right) */
  .poll-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: var(--sp-4);
    margin-bottom: var(--sp-3);
    flex-wrap: wrap;
  }
  .poll-toolbar .poll-filter {
    margin-bottom: 0;
    flex: 1 1 320px;
    min-width: 0;
  }

  .view-switch {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    flex-shrink: 0;
  }
  .view-switch-label {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
  }
  .view-switch-buttons {
    display: inline-flex;
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-pill);
    overflow: hidden;
    background-color: var(--color-paper-2);
  }
  .view-btn {
    appearance: none;
    background: transparent;
    border: 0;
    padding: var(--sp-1) var(--sp-3);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    color: var(--color-ink-2);
    cursor: pointer;
    line-height: 1.6;
    transition: background-color var(--dur-fast) var(--ease-standard),
      color var(--dur-fast) var(--ease-standard);
  }
  .view-btn:hover {
    color: var(--color-ink);
  }
  .view-btn:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
  .view-btn--on {
    background-color: var(--color-ink);
    color: var(--color-paper);
  }

  /* Bars view */
  .poll-bars {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    width: 100%;
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    background-color: var(--color-paper-2);
    padding: var(--sp-3);
  }

  .bar-row {
    display: grid;
    grid-template-columns: 16px 160px 1fr;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-2) var(--sp-1);
    border-bottom: 1px solid var(--color-rule);
  }
  .bar-row:last-child {
    border-bottom: 0;
  }

  .info-cube {
    width: 14px;
    height: 14px;
    border-radius: var(--radius-1);
    border: 1px solid rgba(20, 24, 31, 0.25);
    padding: 0;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
    transition: transform var(--dur-fast) var(--ease-standard),
      box-shadow var(--dur-fast) var(--ease-standard);
  }
  .info-cube:hover {
    transform: scale(1.18);
  }
  .info-cube:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .bar-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }
  .bar-date {
    font-family: var(--font-mono);
    font-size: var(--fs-50);
    color: var(--color-ink-3);
    font-variant-numeric: tabular-nums;
  }
  .bar-pollster {
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    color: var(--color-ink);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bar-track {
    display: flex;
    width: 100%;
    height: 22px;
    border-radius: var(--radius-1);
    overflow: hidden;
    background-color: var(--color-paper);
    border: 1px solid var(--color-rule);
  }

  .bar-seg {
    appearance: none;
    border: 0;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.95);
    font-family: var(--font-mono);
    font-size: 10px;
    font-variant-numeric: tabular-nums;
    overflow: hidden;
    white-space: nowrap;
    min-width: 0;
    cursor: pointer;
    transition: filter var(--dur-fast) var(--ease-standard);
  }
  .bar-seg:hover,
  .bar-seg:focus-visible {
    filter: brightness(1.12);
  }
  .bar-seg:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.85);
  }
  .bar-seg-label {
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35);
    padding: 0 2px;
  }
  .bar-seg--other {
    background: repeating-linear-gradient(
      45deg,
      var(--color-paper-3, #eee),
      var(--color-paper-3, #eee) 4px,
      var(--color-paper-2) 4px,
      var(--color-paper-2) 8px
    );
  }

  .empty-bars {
    text-align: center;
    color: var(--color-ink-3);
    font-style: italic;
    padding: var(--sp-4) var(--sp-3);
    margin: 0;
  }

  @media (max-width: 560px) {
    .bar-row {
      grid-template-columns: 16px 1fr;
      grid-template-rows: auto auto;
      row-gap: var(--sp-1);
    }
    .bar-meta {
      grid-column: 2;
    }
    .bar-track {
      grid-column: 1 / -1;
    }
  }

  /* Shared overlay for click-outside dismissal */
  .popup-overlay {
    position: fixed;
    inset: 0;
    z-index: 99;
  }

  /* Shared positioning mixin for both popups */
  .party-card-popup,
  .poll-info-popup {
    position: fixed;
    z-index: 100;
    left: clamp(8px, calc(var(--anchor-left) + var(--anchor-width) / 2 - 160px), calc(100vw - 328px));
    bottom: calc(100dvh - var(--anchor-top) + 8px);
    border: 1px solid var(--color-rule-strong);
    border-radius: var(--radius-3);
    background-color: var(--color-paper);
    color: var(--color-ink);
    box-shadow: 0 8px 32px -8px rgba(20, 24, 31, 0.28);
  }

  /* Party card popup (clicked from a bar segment) */
  .party-card-popup {
    padding: var(--sp-4);
    max-width: min(320px, calc(100vw - 16px));
    width: 320px;
  }
  .party-card-close {
    position: absolute;
    top: var(--sp-1);
    right: var(--sp-2);
    appearance: none;
    background: none;
    border: 0;
    cursor: pointer;
    font-size: 22px;
    line-height: 1;
    color: var(--color-ink-3);
    padding: 4px 8px;
    border-radius: var(--radius-1);
  }
  .party-card-close:hover {
    color: var(--color-ink);
    background-color: var(--color-paper-2);
  }
  .party-card-close:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .party-card {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: var(--sp-3) var(--sp-4);
    align-items: center;
  }

  .party-card-logo {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-2);
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .party-card-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 6px;
  }
  .party-card-swatch {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-1);
    background-color: var(--party-color);
    border: 1px solid rgba(20, 24, 31, 0.18);
  }

  .party-card-info {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .party-card-share {
    margin: 0;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-size: var(--fs-300, 28px);
    font-weight: 700;
    line-height: 1;
    color: var(--color-ink);
  }
  .party-card-share-pct {
    font-size: var(--fs-100);
    font-weight: 500;
    color: var(--color-ink-3);
    margin-left: 2px;
  }
  .party-card-name {
    margin: var(--sp-1) 0 0;
    font-family: var(--font-sans);
    font-size: var(--fs-100);
    font-weight: 600;
    color: var(--color-ink);
  }
  .party-card-name-full {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    color: var(--color-ink-2);
    line-height: var(--lh-snug);
  }
  .party-card-meta {
    margin: var(--sp-2) 0 0;
    font-family: var(--font-mono);
    font-size: var(--fs-50);
    color: var(--color-ink-3);
    grid-column: 1 / -1;
    border-top: 1px solid var(--color-rule);
    padding-top: var(--sp-2);
  }

  /* Details popup */
  .poll-info-popup {
    padding: 0;
    max-width: min(440px, calc(100vw - 16px));
    width: 440px;
  }

  .dialog-head {
    display: grid;
    grid-template-columns: 14px 1fr auto;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-3) var(--sp-4);
    border-bottom: 1px solid var(--color-rule);
  }
  .dialog-swatch {
    width: 14px;
    height: 14px;
    border-radius: var(--radius-1);
    border: 1px solid rgba(20, 24, 31, 0.25);
  }
  .dialog-title {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-100);
    font-weight: 600;
    color: var(--color-ink);
  }
  .dialog-sub {
    margin: 0;
    font-family: var(--font-mono);
    font-size: var(--fs-50);
    color: var(--color-ink-3);
  }
  .dialog-close {
    appearance: none;
    background: none;
    border: 0;
    cursor: pointer;
    font-size: 24px;
    line-height: 1;
    color: var(--color-ink-3);
    padding: 4px 8px;
    border-radius: var(--radius-1);
  }
  .dialog-close:hover {
    color: var(--color-ink);
    background-color: var(--color-paper-2);
  }
  .dialog-close:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .dialog-grid {
    margin: 0;
    padding: var(--sp-3) var(--sp-4) var(--sp-4);
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--sp-2) var(--sp-4);
    font-family: var(--font-sans);
    font-size: var(--fs-75);
  }
  .dialog-grid dt {
    color: var(--color-ink-3);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    font-weight: 600;
    align-self: baseline;
    white-space: nowrap;
  }
  .dialog-grid dd {
    margin: 0;
    color: var(--color-ink);
  }
  .dialog-notes {
    grid-column: 1 / -1;
    color: var(--color-ink-2);
    font-size: var(--fs-75);
    line-height: 1.5;
    padding-top: var(--sp-2);
    border-top: 1px solid var(--color-rule);
    margin-top: var(--sp-1);
  }
  .dialog-grid dt:has(+ .dialog-notes) {
    grid-column: 1 / -1;
    padding-top: var(--sp-2);
    border-top: 1px solid var(--color-rule);
    margin-top: var(--sp-1);
  }
</style>
