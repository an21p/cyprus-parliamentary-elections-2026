<script lang="ts">
  import type { Lang, PartyId, PollEntry } from '$data/types';
  import { POLLS } from '$data/polls';
  import { getParty } from '$data/parties';
  import { localizedName } from '$i18n/dict';

  type Props = {
    lang: Lang;
    data?: PollEntry[];
    /** Columns to show, in order. Defaults to all major parties. */
    parties?: PartyId[];
  };

  const DEFAULT_PARTIES: PartyId[] = [
    'DISY',
    'AKEL',
    'ELAM',
    'ALMA',
    'ADK',
    'DIKO',
    'VOLT',
    'EDEK',
    'DIPA',
    'KOSP',
    'KEKK'
  ];

  let { lang, data = POLLS, parties = DEFAULT_PARTIES }: Props = $props();

  // Sort state
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
    [...data].sort((a, b) => {
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
    return new Intl.DateTimeFormat(lang === 'el' ? 'el-CY' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(iso));
  }

  function fmtRange(p: PollEntry): string {
    if (p.fieldworkStart === p.fieldworkEnd) return fmtDate(p.fieldworkEnd);
    return `${fmtDate(p.fieldworkStart)} – ${fmtDate(p.fieldworkEnd)}`;
  }

  function fmtShare(v: number | undefined): string {
    return typeof v === 'number' ? v.toFixed(1) : '—';
  }

  function fmtSample(v: number | null): string {
    return v === null ? '—' : new Intl.NumberFormat(lang === 'el' ? 'el-CY' : 'en-GB').format(v);
  }

  function fmtMoE(v: number | null): string {
    return v === null ? '—' : `±${v.toFixed(1)}`;
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
    sortBy: lang === 'el' ? 'Ταξινόμηση' : 'Sort by'
  });
</script>

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
                style="--party-color: {p.colour};"
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
        {#each rows as row, i (i)}
          <tr>
            <th scope="row" class="col-frozen col-frozen-1 col-date">{fmtRange(row)}</th>
            <td class="col-frozen col-frozen-2 col-pollster">{row.pollster}</td>
            <td>{row.commissioner}</td>
            <td class="num">{fmtSample(row.sample)}</td>
            <td class="num">{fmtMoE(row.marginOfError)}</td>
            {#each parties as party (party)}
              <td class="num">{fmtShare(row.shares[party])}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .poll-table-wrap {
    width: 100%;
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    overflow: hidden;
    background-color: var(--color-paper);
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

  /* Frozen columns — left side */
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
    left: 152px;
    border-right: 1px solid var(--color-rule);
  }
  .col-date {
    min-width: 152px;
  }
  .col-pollster {
    min-width: 140px;
  }

  /* Hide frozen second column on the narrowest viewports for breathing room */
  @media (max-width: 480px) {
    .col-frozen-2 {
      position: static;
      left: auto;
    }
  }
</style>
