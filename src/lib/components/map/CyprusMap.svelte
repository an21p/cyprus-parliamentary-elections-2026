<script lang="ts">
  import type { DistrictId, Lang } from '$data/types';
  import { DISTRICTS, getDistrict } from '$data/districts';
  import { localizedName } from '$i18n/dict';

  type Props = {
    lang: Lang;
    selectedDistrict?: DistrictId;
    onSelect?: (id: DistrictId) => void;
  };

  let { lang, selectedDistrict, onSelect }: Props = $props();

  // --------------------------------------------------------------------
  //  Geometry — simplified-but-recognisable district polygons drawn into
  //  a 1000 × 560 viewBox. Coordinates are hand-tuned so the silhouette
  //  reads as Cyprus while remaining schematic enough to be readable on
  //  a 375px screen. Each district's footprint is roughly geographic:
  //   - Kyrenia: narrow strip along the north coast.
  //   - Nicosia: large central+north block (capital area).
  //   - Famagusta: eastern panhandle (incl. occupied area).
  //   - Larnaca: south-east coast.
  //   - Limassol: south coast (largest urban district).
  //   - Paphos: west coast.
  // --------------------------------------------------------------------
  type Region = {
    id: DistrictId;
    /** SVG path "d" attribute */
    path: string;
    /** Label anchor (x, y) inside the viewBox */
    label: { x: number; y: number };
  };

  const REGIONS: Region[] = [
    {
      // Paphos — west
      id: 'PAF',
      path:
        'M 80 290 L 70 250 L 90 215 L 140 200 L 180 215 L 215 245 L 230 290 L 220 335 L 180 360 L 130 355 L 95 330 Z',
      label: { x: 145, y: 285 }
    },
    {
      // Limassol — south, centre-south
      id: 'LIM',
      path:
        'M 230 290 L 215 245 L 270 235 L 330 240 L 390 250 L 430 280 L 445 330 L 410 365 L 350 380 L 290 375 L 250 360 L 220 335 Z',
      label: { x: 335, y: 315 }
    },
    {
      // Larnaca — south-east
      id: 'LAR',
      path:
        'M 445 330 L 430 280 L 480 260 L 540 255 L 590 270 L 620 305 L 615 350 L 560 375 L 500 380 L 450 365 Z',
      label: { x: 525, y: 320 }
    },
    {
      // Famagusta — east + panhandle (NE)
      id: 'FAM',
      path:
        'M 620 305 L 590 270 L 610 215 L 660 195 L 720 200 L 770 220 L 830 240 L 880 240 L 920 220 L 945 230 L 935 270 L 880 290 L 815 285 L 760 280 L 705 290 L 665 305 Z',
      label: { x: 760, y: 250 }
    },
    {
      // Kyrenia — narrow strip along north coast (above Nicosia)
      id: 'KYR',
      path:
        'M 215 165 L 260 150 L 330 142 L 410 138 L 490 140 L 560 148 L 605 160 L 610 195 L 555 200 L 480 205 L 410 205 L 340 200 L 270 195 L 220 195 Z',
      label: { x: 410, y: 172 }
    },
    {
      // Nicosia — large central block (capital area). Bordered by Kyrenia (N), Famagusta (E), Larnaca/Limassol (S), Paphos (W)
      id: 'NIC',
      path:
        'M 215 165 L 215 245 L 270 235 L 330 240 L 390 250 L 430 280 L 480 260 L 540 255 L 590 270 L 620 305 L 665 305 L 660 260 L 610 215 L 605 160 L 560 148 L 490 140 L 410 138 L 330 142 L 260 150 Z',
      label: { x: 420, y: 220 }
    }
  ];

  // --------------------------------------------------------------------
  // Tooltip state
  // --------------------------------------------------------------------
  let hoverId = $state<DistrictId | null>(null);
  let focusId = $state<DistrictId | null>(null);
  let svgEl: SVGSVGElement | undefined = $state();
  let svgRect = $state<{ width: number; height: number }>({ width: 1000, height: 560 });

  $effect(() => {
    if (!svgEl) return;
    const ro = new ResizeObserver(() => {
      const r = svgEl!.getBoundingClientRect();
      svgRect = { width: r.width, height: r.height };
    });
    ro.observe(svgEl);
    return () => ro.disconnect();
  });

  const activeId = $derived(hoverId ?? focusId ?? selectedDistrict ?? null);
  const activeDistrict = $derived(activeId ? getDistrict(activeId) : null);

  function handleSelect(id: DistrictId) {
    onSelect?.(id);
  }

  function handleKey(e: KeyboardEvent, id: DistrictId) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(id);
    }
  }

  function fmtVoters(v: number): string {
    return new Intl.NumberFormat(lang === 'el' ? 'el-CY' : 'en-GB').format(v);
  }

  // --------------------------------------------------------------------
  // Labels for hover panel
  // --------------------------------------------------------------------
  const L = $derived({
    title:
      lang === 'el'
        ? 'Επαρχίες Κύπρου — Βουλευτικές Εκλογές 2026'
        : 'Cyprus electoral districts — 2026 parliamentary elections',
    seats2026: lang === 'el' ? 'έδρες 2026' : 'seats 2026',
    voters: lang === 'el' ? 'εγγεγραμμένοι ψηφοφόροι' : 'registered voters',
    ballot: lang === 'el' ? 'χρώμα ψηφοδελτίου' : 'ballot colour',
    crosses: lang === 'el' ? 'σταυροί προτίμησης' : 'preference crosses',
    legend: lang === 'el' ? 'Κάντε κλικ σε επαρχία για επιλογή' : 'Click a district to select',
    swapPaphos: lang === 'el' ? '+1 έδρα από τη Λευκωσία (2026)' : '+1 seat from Nicosia (2026)',
    swapNicosia: lang === 'el' ? '−1 έδρα προς την Πάφο (2026)' : '−1 seat to Paphos (2026)'
  });
</script>

<div class="map-wrap">
  <svg
    bind:this={svgEl}
    role="img"
    aria-label={L.title}
    viewBox="0 0 1000 560"
    preserveAspectRatio="xMidYMid meet"
  >
    <title>{L.title}</title>

    <!-- Sea background -->
    <defs>
      <pattern id="sea" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="var(--color-paper-2)" />
        <path d="M0 7 Q3.5 4 7 7 T 14 7" stroke="var(--color-rule)" stroke-width="0.5" fill="none" />
      </pattern>
    </defs>
    <rect x="0" y="0" width="1000" height="560" fill="url(#sea)" />

    <!-- Island silhouette stroke (drawn under the regions) -->
    <g class="silhouette">
      <path
        d="M 70 250 L 90 215 L 140 200 L 180 215 L 215 165 L 260 150 L 330 142 L 410 138 L 490 140 L 560 148 L 605 160 L 610 195 L 660 195 L 720 200 L 770 220 L 830 240 L 880 240 L 920 220 L 945 230 L 935 270 L 880 290 L 815 285 L 760 280 L 705 290 L 665 305 L 620 305 L 615 350 L 560 375 L 500 380 L 450 365 L 410 365 L 350 380 L 290 375 L 250 360 L 220 335 L 180 360 L 130 355 L 95 330 L 80 290 Z"
        fill="var(--color-paper)"
        stroke="var(--color-rule-strong)"
        stroke-width="1.25"
        stroke-linejoin="round"
      />
    </g>

    <!-- Districts -->
    <g class="districts">
      {#each REGIONS as r (r.id)}
        {@const d = getDistrict(r.id)}
        {@const isActive = activeId === r.id}
        {@const isSelected = selectedDistrict === r.id}
        <g
          class="district"
          class:district--active={isActive}
          class:district--selected={isSelected}
          aria-label={`${localizedName(d, lang)}: ${d.seats2026} ${L.seats2026}`}
        >
          <path
            d={r.path}
            fill={d.ballotColour}
            fill-opacity="0.32"
            stroke="var(--color-ink-2)"
            stroke-width="1.25"
            stroke-linejoin="round"
            tabindex="0"
            role="button"
            aria-pressed={isSelected}
            onmouseenter={() => (hoverId = r.id)}
            onmouseleave={() => (hoverId = null)}
            onfocus={() => (focusId = r.id)}
            onblur={() => (focusId = null)}
            onclick={() => handleSelect(r.id)}
            onkeydown={(e) => handleKey(e, r.id)}
          />
          <text
            class="district-label"
            x={r.label.x}
            y={r.label.y}
            text-anchor="middle"
            dominant-baseline="middle"
            pointer-events="none"
          >
            {localizedName(d, lang)}
          </text>
          <text
            class="district-seats"
            x={r.label.x}
            y={r.label.y + 18}
            text-anchor="middle"
            dominant-baseline="middle"
            pointer-events="none"
          >
            {d.seats2026} {L.seats2026}
          </text>
        </g>
      {/each}
    </g>

    <!-- Seat-swap badges -->
    <g class="badges" aria-hidden="true">
      <!-- Paphos +1 -->
      <g transform="translate(170, 240)">
        <circle r="22" fill="var(--color-positive)" stroke="var(--color-paper)" stroke-width="2.5" />
        <text class="badge-text" text-anchor="middle" dominant-baseline="middle" fill="white">
          +1
        </text>
      </g>
      <!-- Nicosia −1 -->
      <g transform="translate(460, 195)">
        <circle r="22" fill="var(--color-fact)" stroke="var(--color-paper)" stroke-width="2.5" />
        <text class="badge-text" text-anchor="middle" dominant-baseline="middle" fill="white">
          −1
        </text>
      </g>
    </g>
  </svg>

  <!-- Static legend explaining the swap badges -->
  <p class="map-legend">
    <span class="swap swap--pos"><span class="swap-dot" aria-hidden="true">+1</span> {L.swapPaphos}</span>
    <span class="swap swap--neg"><span class="swap-dot" aria-hidden="true">−1</span> {L.swapNicosia}</span>
  </p>

  <!-- Hover/focus tooltip rendered as a side panel for accessibility -->
  {#if activeDistrict}
    <aside class="info" role="status" aria-live="polite">
      <header class="info-header">
        <span
          class="info-swatch"
          style="background-color: {activeDistrict.ballotColour};"
          aria-hidden="true"
        ></span>
        <p class="info-name">{localizedName(activeDistrict, lang)}</p>
      </header>
      <dl class="info-stats">
        <div>
          <dt>{L.seats2026}</dt>
          <dd>{activeDistrict.seats2026}</dd>
        </div>
        <div>
          <dt>{L.voters}</dt>
          <dd>{fmtVoters(activeDistrict.registeredVoters2026)}</dd>
        </div>
        <div>
          <dt>{L.ballot}</dt>
          <dd>{localizedName(activeDistrict.ballotColourLabel, lang)}</dd>
        </div>
        <div>
          <dt>{L.crosses}</dt>
          <dd>{activeDistrict.preferenceCrosses}</dd>
        </div>
      </dl>
    </aside>
  {:else}
    <p class="info info--empty">{L.legend}</p>
  {/if}
</div>

<style>
  .map-wrap {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--sp-4);
    width: 100%;
  }

  @media (min-width: 768px) {
    .map-wrap {
      grid-template-columns: minmax(0, 2fr) minmax(220px, 1fr);
      align-items: start;
    }
  }

  svg {
    width: 100%;
    height: auto;
    display: block;
    grid-column: 1 / -1;
    background-color: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
  }

  @media (min-width: 768px) {
    svg {
      grid-column: 1;
    }
  }

  .district path {
    cursor: pointer;
    transition: fill-opacity var(--dur-fast) var(--ease-standard),
      stroke-width var(--dur-fast) var(--ease-standard);
  }

  .district path:hover,
  .district--active path {
    fill-opacity: 0.6;
  }

  .district--selected path {
    fill-opacity: 0.75;
    stroke-width: 2.5;
    stroke: var(--color-ink);
  }

  .district path:focus-visible {
    outline: none;
    stroke: var(--color-focus);
    stroke-width: 3;
  }

  .district-label {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 600;
    fill: var(--color-ink);
    letter-spacing: var(--tracking-snug);
  }

  .district-seats {
    font-family: var(--font-mono);
    font-size: 13px;
    fill: var(--color-ink-3);
    letter-spacing: var(--tracking-snug);
  }

  .badge-text {
    font-family: var(--font-sans);
    font-weight: 700;
    font-size: 16px;
  }

  .map-legend {
    margin: 0;
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--sp-3);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    color: var(--color-ink-3);
    grid-column: 1 / -1;
  }

  .swap {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
  }

  .swap-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: var(--radius-pill);
    font-family: var(--font-sans);
    font-weight: 700;
    font-size: 12px;
    color: var(--color-paper);
  }

  .swap--pos .swap-dot {
    background-color: var(--color-positive);
  }
  .swap--neg .swap-dot {
    background-color: var(--color-fact);
  }

  .info {
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    padding: var(--sp-4);
    min-width: 220px;
    grid-column: 1 / -1;
  }

  @media (min-width: 768px) {
    .info {
      grid-column: 2;
      position: sticky;
      top: calc(var(--header-h-md) + var(--sp-4));
    }
  }

  .info--empty {
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    color: var(--color-ink-3);
    margin: 0;
    padding: var(--sp-4);
    background-color: var(--color-paper-2);
    border: 1px dashed var(--color-rule);
    border-radius: var(--radius-3);
  }

  .info-header {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    margin-bottom: var(--sp-3);
  }

  .info-swatch {
    width: 14px;
    height: 14px;
    border-radius: var(--radius-1);
    border: 1px solid rgba(20, 24, 31, 0.18);
    flex-shrink: 0;
  }

  .info-name {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--fs-300);
    font-weight: 600;
    color: var(--color-ink);
  }

  .info-stats {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: var(--sp-2);
    margin: 0;
  }

  .info-stats > div {
    display: flex;
    justify-content: space-between;
    gap: var(--sp-3);
    padding-block: var(--sp-1);
    border-top: 1px solid var(--color-rule);
  }

  .info-stats > div:first-child {
    border-top: 0;
  }

  .info-stats dt {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    margin: 0;
  }

  .info-stats dd {
    margin: 0;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: var(--color-ink);
  }
</style>
