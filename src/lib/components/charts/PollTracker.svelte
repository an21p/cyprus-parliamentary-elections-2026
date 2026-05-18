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

  const DEFAULT_PARTIES: PartyId[] = [
    'DISY',
    'AKEL',
    'ELAM',
    'ALMA',
    'ADK',
    'DIKO',
    'VOLT'
  ];

  let { lang, parties = DEFAULT_PARTIES, data = POLLS }: Props = $props();

  // ----- Active set (toggleable via legend) ------------------------------
  // Initialised from props in an effect so changes to `parties` are honoured.
  let activeIds = $state<PartyId[]>([]);
  $effect(() => {
    activeIds = [...parties];
  });

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

  const pointsByParty = $derived.by<Record<PartyId, Point[]>>(() => {
    const out: Partial<Record<PartyId, Point[]>> = {};
    for (const party of parties) {
      const series: Point[] = [];
      for (const poll of data) {
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

  // ----- Tooltip / hover -------------------------------------------------
  let hover = $state<{ point: Point; x: number; y: number } | null>(null);

  function handlePointEnter(point: Point) {
    hover = { point, x: xScale(point.date), y: yScale(point.share) };
  }
  function handlePointLeave() {
    hover = null;
  }

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
  <svg
    role="img"
    aria-label={ariaLabel}
    viewBox="0 0 {width} {height}"
    width={width}
    height={height}
    preserveAspectRatio="xMidYMid meet"
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
        {#each series as point (point.mid)}
          <circle
            cx={xScale(point.date)}
            cy={yScale(point.share)}
            r="3"
            fill={p.colour}
            stroke="var(--color-paper)"
            stroke-width="1"
            tabindex={on ? 0 : -1}
            role="button"
            aria-label={`${localizedName(p.shortName, lang)}, ${point.share}%, ${fmtDateRange(point.poll)}`}
            onmouseenter={() => handlePointEnter(point)}
            onmouseleave={handlePointLeave}
            onfocus={() => handlePointEnter(point)}
            onblur={handlePointLeave}
          />
        {/each}
      </g>
    {/each}
  </svg>

  {#if hover}
    {@const p = getParty(hover.point.party)}
    {@const left = Math.min(width - 220, Math.max(8, hover.x + 10))}
    {@const top = Math.max(8, hover.y - 90)}
    <div
      class="tooltip"
      role="tooltip"
      style="left: {left}px; top: {top}px;"
    >
      <p class="tip-party">
        <span class="tip-sw" style="background-color: {p.colour};" aria-hidden="true"></span>
        <strong>{localizedName(p.shortName, lang)}</strong>
        <span class="tip-share">{hover.point.share}%</span>
      </p>
      <p class="tip-meta">
        <span class="tip-pollster">{hover.point.poll.pollster}</span>
        <span class="tip-sep">·</span>
        <span class="tip-comm">{hover.point.poll.commissioner}</span>
      </p>
      <p class="tip-date">{fmtDateRange(hover.point.poll)}</p>
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

  .series circle {
    cursor: pointer;
    transition: r var(--dur-fast) var(--ease-standard);
  }

  .series circle:hover,
  .series circle:focus-visible {
    r: 5;
  }

  .series circle:focus-visible {
    outline: none;
    stroke: var(--color-focus);
    stroke-width: 2;
  }

  .series--off {
    opacity: 0.08;
    pointer-events: none;
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

  .tip-party {
    margin: 0 0 var(--sp-1);
    display: flex;
    align-items: center;
    gap: var(--sp-2);
  }

  .tip-share {
    margin-left: auto;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }

  .tip-sw {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-1);
  }

  .tip-meta,
  .tip-date {
    margin: 0;
    color: rgba(255, 255, 255, 0.78);
  }

  .tip-sep {
    margin-inline: 0.25em;
    opacity: 0.5;
  }

  .legend-wrap {
    margin-top: var(--sp-1);
  }
</style>
