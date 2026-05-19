<script lang="ts">
  import type { Lang, PartyId, PollEntry } from '$data/types';
  import { POLLS } from '$data/polls';
  import { getParty } from '$data/parties';
  import { localizedName } from '$i18n/dict';
  import LegendSwatches, { type LegendItem } from './LegendSwatches.svelte';

  type Props = {
    lang: Lang;
    /** Parties to plot. Default = 7 parties that polled consistently. */
    parties?: PartyId[];
    /** Override the underlying POLLS dataset (used for tests/storybook). */
    data?: PollEntry[];
  };

  // Top five parties competing at the top of recent polls.
  const DEFAULT_PARTIES: PartyId[] = ['DISY', 'AKEL', 'ELAM', 'ALMA', 'DIKO'];

  let { lang, parties = DEFAULT_PARTIES, data = POLLS }: Props = $props();

  // ----- Active set (toggleable via legend) ------------------------------
  // Initialised from props in an effect so changes to `parties` are honoured.
  let activeIds = $state<PartyId[]>([]);
  $effect(() => {
    activeIds = [...parties];
  });

  // ----- Time range filter ----------------------------------------------
  type RangeOption = '3m' | '6m' | '12m' | 'all';
  let range = $state<RangeOption>('3m');

  const RANGE_OPTIONS: { value: RangeOption; months: number | null }[] = [
    { value: '3m', months: 3 },
    { value: '6m', months: 6 },
    { value: '12m', months: 12 },
    { value: 'all', months: null }
  ];

  function rangeLabel(value: RangeOption): string {
    if (lang === 'el') {
      return value === '3m' ? '3 μήνες'
        : value === '6m' ? '6 μήνες'
        : value === '12m' ? '1 έτος'
        : 'Όλα';
    }
    return value === '3m' ? '3 months'
      : value === '6m' ? '6 months'
      : value === '12m' ? '1 year'
      : 'All time';
  }

  // ----- Plot points -----------------------------------------------------
  type Point = {
    party: PartyId;
    date: Date;
    share: number;
    poll: PollEntry;
    mid: string; // midpoint of fieldwork, ISO date
  };

  function midDate(poll: PollEntry): Date {
    const a = new Date(poll.fieldworkStart).getTime();
    const b = new Date(poll.fieldworkEnd).getTime();
    return new Date((a + b) / 2);
  }

  // Anchor the range window to the most recent poll so "last 3 months"
  // always lines up with the freshest data even if the system clock drifts.
  const anchorTime = $derived.by(() => {
    if (data.length === 0) return Date.now();
    let max = -Infinity;
    for (const p of data) {
      const t = midDate(p).getTime();
      if (t > max) max = t;
    }
    return max;
  });

  const filteredData = $derived.by<PollEntry[]>(() => {
    const opt = RANGE_OPTIONS.find((r) => r.value === range);
    if (!opt || opt.months === null) return data;
    const cutoff = new Date(anchorTime);
    cutoff.setMonth(cutoff.getMonth() - opt.months);
    const cutoffT = cutoff.getTime();
    return data.filter((p) => midDate(p).getTime() >= cutoffT);
  });

  const pointsByParty = $derived.by<Record<PartyId, Point[]>>(() => {
    const out: Partial<Record<PartyId, Point[]>> = {};
    for (const party of parties) {
      const series: Point[] = [];
      for (const poll of filteredData) {
        const share = poll.shares[party];
        if (typeof share !== 'number') continue;
        const d = midDate(poll);
        series.push({
          party,
          date: d,
          share,
          poll,
          mid: d.toISOString().slice(0, 10)
        });
      }
      // chronological (oldest first) for line drawing
      series.sort((a, b) => a.date.getTime() - b.date.getTime());
      out[party] = series;
    }
    return out as Record<PartyId, Point[]>;
  });

  // ----- Responsive geometry --------------------------------------------
  let wrapper: HTMLDivElement | undefined = $state();
  let width = $state(640);

  $effect(() => {
    if (!wrapper) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = Math.round(e.contentRect.width);
        if (w > 0) width = w;
      }
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  });

  const isNarrow = $derived(width < 520);
  const height = $derived(isNarrow ? 280 : 360);
  const margin = $derived({
    top: 16,
    right: isNarrow ? 12 : 24,
    bottom: 48,
    left: 36
  });
  const innerW = $derived(Math.max(40, width - margin.left - margin.right));
  const innerH = $derived(Math.max(40, height - margin.top - margin.bottom));

  // ----- Scales ----------------------------------------------------------
  const allPoints = $derived<Point[]>(
    Object.values(pointsByParty).flat() as Point[]
  );
  const allDates = $derived(allPoints.map((p) => p.date.getTime()));
  const tMin = $derived(allDates.length ? Math.min(...allDates) : Date.now());
  const tMax = $derived(allDates.length ? Math.max(...allDates) : Date.now());

  const yMax = $derived(
    Math.max(
      30,
      Math.ceil(Math.max(0, ...allPoints.map((p) => p.share)))
    )
  );

  function xScale(d: Date): number {
    if (tMax === tMin) return margin.left + innerW / 2;
    return margin.left + ((d.getTime() - tMin) / (tMax - tMin)) * innerW;
  }

  function yScale(v: number): number {
    return margin.top + innerH - (v / yMax) * innerH;
  }

  // ----- Line path -------------------------------------------------------
  function linePath(series: Point[]): string {
    if (series.length === 0) return '';
    return series
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.date).toFixed(2)} ${yScale(p.share).toFixed(2)}`)
      .join(' ');
  }

  // ----- Axis ticks ------------------------------------------------------
  // Y-axis: every 5%
  const yTicks = $derived.by(() => {
    const ticks: number[] = [];
    for (let v = 0; v <= yMax; v += 5) ticks.push(v);
    return ticks;
  });

  // X-axis: month ticks. Thin out when narrow.
  const xTicks = $derived.by<{ d: Date; label: string }[]>(() => {
    const start = new Date(tMin);
    const end = new Date(tMax);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];
    const out: { d: Date; label: string }[] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const fmt = new Intl.DateTimeFormat(lang === 'el' ? 'el-CY' : 'en-GB', {
      month: 'short',
      year: '2-digit'
    });
    while (cursor.getTime() <= end.getTime()) {
      out.push({ d: new Date(cursor), label: fmt.format(cursor) });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    // Thin out if too many
    const target = isNarrow ? 4 : 8;
    if (out.length <= target) return out;
    const step = Math.ceil(out.length / target);
    return out.filter((_, i) => i % step === 0);
  });

  // ----- Spike cursor / unified hover ------------------------------------
  // Snap cursor to the nearest poll midpoint date and show every active
  // party's value at that date in a single tooltip.
  const uniqueMidDates = $derived.by<Date[]>(() => {
    const seen = new Map<string, Date>();
    for (const p of allPoints) {
      if (!seen.has(p.mid)) seen.set(p.mid, p.date);
    }
    return Array.from(seen.values()).sort(
      (a, b) => a.getTime() - b.getTime()
    );
  });

  let hoverMid = $state<string | null>(null);
  let svgEl: SVGSVGElement | undefined = $state();

  function snapToCursor(clientX: number) {
    if (!svgEl || uniqueMidDates.length === 0) return;
    const rect = svgEl.getBoundingClientRect();
    if (rect.width === 0) return;
    const x = ((clientX - rect.left) / rect.width) * width;
    let nearest = uniqueMidDates[0];
    let best = Math.abs(xScale(nearest) - x);
    for (let i = 1; i < uniqueMidDates.length; i++) {
      const d = Math.abs(xScale(uniqueMidDates[i]) - x);
      if (d < best) {
        best = d;
        nearest = uniqueMidDates[i];
      }
    }
    hoverMid = nearest.toISOString().slice(0, 10);
  }

  function handleMove(ev: MouseEvent) {
    snapToCursor(ev.clientX);
  }
  function handleLeave() {
    hoverMid = null;
  }

  type Row = { party: PartyId; point: Point; colour: string; name: string };

  const hoverRows = $derived.by<Row[]>(() => {
    if (!hoverMid) return [];
    const rows: Row[] = [];
    for (const party of parties) {
      if (!activeIds.includes(party)) continue;
      const series = pointsByParty[party] ?? [];
      // If multiple polls share the same midpoint, take the last one.
      let found: Point | undefined;
      for (const pt of series) if (pt.mid === hoverMid) found = pt;
      if (!found) continue;
      const p = getParty(party);
      rows.push({
        party,
        point: found,
        colour: p.colour,
        name: localizedName(p.shortName, lang)
      });
    }
    rows.sort((a, b) => b.point.share - a.point.share);
    return rows;
  });

  const hoverX = $derived(
    hoverMid && uniqueMidDates.length
      ? xScale(uniqueMidDates.find((d) => d.toISOString().slice(0, 10) === hoverMid) ?? uniqueMidDates[0])
      : 0
  );

  const hoverDateLabel = $derived.by(() => {
    if (!hoverMid) return '';
    const d = new Date(hoverMid);
    return new Intl.DateTimeFormat(lang === 'el' ? 'el-CY' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  });

  const hoverPollsters = $derived.by<string[]>(() => {
    const set = new Set<string>();
    for (const r of hoverRows) set.add(r.point.poll.pollster);
    return Array.from(set);
  });

  function fmtDateRange(poll: PollEntry): string {
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const f = new Intl.DateTimeFormat(lang === 'el' ? 'el-CY' : 'en-GB', opts);
    return `${f.format(new Date(poll.fieldworkStart))} – ${f.format(new Date(poll.fieldworkEnd))}`;
  }

  // ----- Legend ---------------------------------------------------------
  const legendItems = $derived<LegendItem[]>(
    parties.map((id) => {
      const p = getParty(id);
      return { id, label: localizedName(p.shortName, lang), colour: p.colour };
    })
  );

  function onToggle(id: string) {
    const pid = id as PartyId;
    if (activeIds.includes(pid)) {
      activeIds = activeIds.filter((x) => x !== pid);
    } else {
      activeIds = [...activeIds, pid];
    }
  }

  const ariaLabel = $derived(
    lang === 'el'
      ? 'Διαχρονικό γράφημα δημοσκοπήσεων ανά κόμμα'
      : 'Time-series chart of polling share by party'
  );
</script>

<div class="poll-tracker" bind:this={wrapper}>
  <div class="range-bar" role="group" aria-label={lang === 'el' ? 'Χρονικό εύρος' : 'Time range'}>
    <span class="range-label">{lang === 'el' ? 'Χρονικό εύρος' : 'Time range'}</span>
    <div class="range-buttons">
      {#each RANGE_OPTIONS as opt (opt.value)}
        {@const on = range === opt.value}
        <button
          type="button"
          class="range-btn"
          class:range-btn--on={on}
          aria-pressed={on}
          onclick={() => (range = opt.value)}
        >
          {rangeLabel(opt.value)}
        </button>
      {/each}
    </div>
  </div>

  <svg
    bind:this={svgEl}
    role="img"
    aria-label={ariaLabel}
    viewBox="0 0 {width} {height}"
    width={width}
    height={height}
    preserveAspectRatio="xMidYMid meet"
    onmousemove={handleMove}
    onmouseleave={handleLeave}
  >
    <title>{ariaLabel}</title>

    <!-- y gridlines + labels -->
    <g class="grid">
      {#each yTicks as v (v)}
        <line
          x1={margin.left}
          x2={margin.left + innerW}
          y1={yScale(v)}
          y2={yScale(v)}
        />
        <text class="tick-label" x={margin.left - 6} y={yScale(v)} text-anchor="end" dominant-baseline="middle">{v}%</text>
      {/each}
    </g>

    <!-- x ticks -->
    <g class="x-axis">
      {#each xTicks as tick, i (i)}
        <line
          x1={xScale(tick.d)}
          x2={xScale(tick.d)}
          y1={margin.top + innerH}
          y2={margin.top + innerH + 4}
        />
        <text
          class="tick-label"
          x={xScale(tick.d)}
          y={margin.top + innerH + 8}
          text-anchor={isNarrow ? 'end' : 'middle'}
          transform={isNarrow ? `rotate(-40, ${xScale(tick.d)}, ${margin.top + innerH + 8})` : ''}
        >
          {tick.label}
        </text>
      {/each}
    </g>

    <!-- lines + points per party -->
    {#each parties as party (party)}
      {@const series = pointsByParty[party] ?? []}
      {@const p = getParty(party)}
      {@const on = activeIds.includes(party)}
      <g class="series" class:series--off={!on} aria-label={localizedName(p.shortName, lang)}>
        <path d={linePath(series)} stroke={p.colour} fill="none" stroke-width="1.75" />
        {#each series as point, i (i)}
          <circle
            class="data-dot"
            cx={xScale(point.date)}
            cy={yScale(point.share)}
            r="3"
            fill={p.colour}
            stroke="var(--color-paper)"
            stroke-width="1"
          />
        {/each}
      </g>
    {/each}

    <!-- spike cursor: vertical line + highlighted points at snapped date -->
    {#if hoverMid}
      <line
        class="spike-line"
        x1={hoverX}
        x2={hoverX}
        y1={margin.top}
        y2={margin.top + innerH}
      />
      {#each hoverRows as row (row.party)}
        <circle
          class="spike-dot"
          cx={hoverX}
          cy={yScale(row.point.share)}
          r="5"
          fill={row.colour}
          stroke="var(--color-paper)"
          stroke-width="1.5"
        />
      {/each}
    {/if}

    <!-- transparent hit area: receives mousemove across the plot region -->
    <rect
      class="hover-overlay"
      x={margin.left}
      y={margin.top}
      width={innerW}
      height={innerH}
      fill="transparent"
    />
  </svg>

  {#if hoverMid && hoverRows.length}
    {@const tipW = 220}
    {@const flip = hoverX + tipW + 16 > width}
    {@const left = flip
      ? Math.max(8, hoverX - tipW - 10)
      : Math.min(width - tipW - 8, hoverX + 10)}
    <div class="tooltip" role="tooltip" style="left: {left}px; top: {margin.top + 8}px;">
      <p class="tip-date">{hoverDateLabel}</p>
      <ul class="tip-rows" role="list">
        {#each hoverRows as row (row.party)}
          <li class="tip-row">
            <span class="tip-sw" style="background-color: {row.colour};" aria-hidden="true"></span>
            <span class="tip-name">{row.name}</span>
            <span class="tip-share">{row.point.share}%</span>
          </li>
        {/each}
      </ul>
      {#if hoverPollsters.length}
        <p class="tip-meta">{hoverPollsters.join(' · ')}</p>
      {/if}
    </div>
  {/if}

  <div class="legend-wrap">
    <LegendSwatches
      items={legendItems}
      {lang}
      active={activeIds}
      onToggle={onToggle}
      title={lang === 'el' ? 'Κόμματα' : 'Parties'}
    />
  </div>
</div>

<style>
  .poll-tracker {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
    width: 100%;
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
    background-color: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
  }

  .grid line {
    stroke: var(--color-rule);
    stroke-width: 0.5;
  }

  .x-axis line {
    stroke: var(--color-rule-strong);
    stroke-width: 0.5;
  }

  .tick-label {
    font-family: var(--font-mono);
    font-size: 10px;
    fill: var(--color-ink-3);
  }

  .data-dot {
    pointer-events: none;
  }

  .series--off {
    opacity: 0.08;
    pointer-events: none;
  }

  .spike-line {
    stroke: var(--color-ink-3);
    stroke-width: 1;
    stroke-dasharray: 3 3;
    pointer-events: none;
  }

  .spike-dot {
    pointer-events: none;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.25));
  }

  .hover-overlay {
    cursor: crosshair;
  }

  .tooltip {
    position: absolute;
    max-width: 220px;
    background-color: var(--color-ink);
    color: var(--color-paper);
    border-radius: var(--radius-2);
    padding: var(--sp-2) var(--sp-3);
    box-shadow: var(--shadow-overlay);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    line-height: var(--lh-snug);
    pointer-events: none;
    z-index: var(--z-overlay);
  }

  .tip-date {
    margin: 0 0 var(--sp-2);
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, 0.92);
    font-weight: 600;
  }

  .tip-rows {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .tip-row {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
  }

  .tip-name {
    color: rgba(255, 255, 255, 0.7);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tip-share {
    margin-left: auto;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
  }

  .tip-sw {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-1);
    flex-shrink: 0;
  }

  .tip-meta {
    margin: var(--sp-2) 0 0;
    color: rgba(255, 255, 255, 0.55);
    font-size: calc(var(--fs-50) * 0.92);
  }

  .legend-wrap {
    margin-top: var(--sp-1);
  }

  .range-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--sp-2) var(--sp-3);
  }

  .range-label {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
  }

  .range-buttons {
    display: inline-flex;
    align-items: stretch;
    flex-wrap: wrap;
    gap: var(--sp-1);
    padding: 2px;
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-pill);
  }

  .range-btn {
    appearance: none;
    border: none;
    background: transparent;
    /* Fix the box height so toggling font-weight on the active pill
       can never subpixel-shift its neighbours. */
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 var(--sp-3);
    border-radius: var(--radius-pill);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    line-height: 1;
    color: var(--color-ink-2);
    cursor: pointer;
    transition: background-color var(--dur-fast) var(--ease-standard),
      color var(--dur-fast) var(--ease-standard);
  }

  .range-btn:hover {
    color: var(--color-ink);
  }

  .range-btn:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .range-btn--on {
    background-color: var(--color-ink);
    color: var(--color-paper);
    font-weight: 600;
  }
</style>
