<script lang="ts">
  import type { Lang } from '$i18n/dict';
  import type { AllocationResult, PartyId } from '$data/types';
  import { getParty, PARTIES } from '$data/parties';

  type Props = {
    result: AllocationResult;
    lang: Lang;
  };
  let { result, lang }: Props = $props();

  const localeForNumbers = $derived(lang === 'el' ? 'el-CY' : 'en-CY');
  const numFmt = $derived(new Intl.NumberFormat(localeForNumbers));

  // Order parties by a stable "political spectrum" for the hemicycle.
  // Far-left to far-right reading: AKEL, KOSP, EDEK, DIPA, DIMAL, ADK, VOLT,
  // ALMA, DISY, DIKO, KEKK, DEK, GRNC, AGRO, FARL, POPSF, SIKOU, ELAM, LAKE.
  // Parties with 0 seats are ignored but the same order is applied to those
  // that do have seats. This is editorial - Cyprus's politics doesn't fit a
  // clean Western left-right axis, but readers expect one.
  const SPECTRUM_ORDER: PartyId[] = [
    'FARL', 'POPSF', 'AKEL', 'KOSP', 'EDEK', 'DIPA', 'DIMAL',
    'ADK', 'VOLT', 'ALMA', 'DISY', 'DIKO', 'KEKK', 'DEK',
    'GRNC', 'AGRO', 'SIKOU', 'ELAM', 'LAKE'
  ];

  const orderedSeats = $derived.by(() => {
    const m = new Map<PartyId, number>();
    for (const row of result.perParty) m.set(row.partyId, row.seats);
    const seq: { partyId: PartyId; seats: number }[] = [];
    for (const pid of SPECTRUM_ORDER) {
      const s = m.get(pid) ?? 0;
      if (s > 0) seq.push({ partyId: pid, seats: s });
    }
    // Append any party not in SPECTRUM_ORDER for safety.
    for (const row of result.perParty) {
      if (!SPECTRUM_ORDER.includes(row.partyId)) seq.push(row);
    }
    return seq;
  });

  const totalSeatsAwarded = $derived(
    result.perParty.reduce((a, p) => a + p.seats, 0)
  );

  // Hemicycle geometry - 56 seats, multiple arcs.
  const SEATS_TOTAL = 56;
  const ROWS = 5;
  // Distribute seats per row roughly proportional to row index (outer rows
  // hold more dots than inner ones - the classic hemicycle look).
  const SEATS_PER_ROW: number[] = (() => {
    // Weights 1..ROWS, normalised so sum ≈ SEATS_TOTAL.
    const weights = Array.from({ length: ROWS }, (_, i) => i + 2);
    const wSum = weights.reduce((a, b) => a + b, 0);
    let counts = weights.map((w) => Math.round((w / wSum) * SEATS_TOTAL));
    const off = SEATS_TOTAL - counts.reduce((a, b) => a + b, 0);
    counts[counts.length - 1] += off;
    return counts;
  })();

  type Seat = { x: number; y: number; partyId: PartyId | null };

  // Build the flat seat sequence in spectrum order, then arrange into arcs.
  const seatSeq = $derived.by<PartyId[]>(() => {
    const flat: PartyId[] = [];
    for (const row of orderedSeats) {
      for (let i = 0; i < row.seats; i++) flat.push(row.partyId);
    }
    return flat;
  });

  const seats = $derived.by<Seat[]>(() => {
    const cx = 50;
    const cy = 48;
    // Each row uses a different radius.
    const rMin = 18;
    const rMax = 42;

    // 1. Lay out every seat slot across all arcs, recording its angle.
    type Slot = { x: number; y: number; theta: number };
    const slots: Slot[] = [];
    for (let r = 0; r < ROWS; r++) {
      const n = SEATS_PER_ROW[r];
      const radius = rMin + ((rMax - rMin) * r) / (ROWS - 1);
      for (let i = 0; i < n; i++) {
        // The +0.5 offset centres the dots between arcs visually.
        const theta = Math.PI - (Math.PI * (i + 0.5)) / n;
        const x = cx + radius * Math.cos(theta);
        const y = cy - radius * Math.sin(theta);
        slots.push({ x, y, theta });
      }
    }

    // 2. Sort all slots radially (leftmost angle first → rightmost angle last).
    //    Stable: ties on angle keep insertion order (inner→outer), so within a
    //    vertical column the bottom dot comes first.
    slots.sort((a, b) => b.theta - a.theta);

    // 3. Assign parties in spectrum order to sorted slots, so each party gets
    //    a contiguous angular wedge (pie-slice) rather than spreading across
    //    horizontal rows.
    return slots.map((slot, idx) => ({
      x: slot.x,
      y: slot.y,
      partyId: seatSeq[idx] ?? null
    }));
  });

  const txt = $derived({
    title: lang === 'el' ? 'Σύνθεση Βουλής' : 'Parliament composition',
    seatsOf: lang === 'el' ? 'από' : 'of',
    seats: lang === 'el' ? 'έδρες' : 'seats',
    legend: lang === 'el' ? 'Έδρες ανά κόμμα' : 'Seats by party',
    coalitionTitle:
      lang === 'el' ? 'Αριθμητική συνασπισμού' : 'Coalition mathematics',
    needForMajority:
      lang === 'el' ? '29 έδρες για πλειοψηφία' : '29 seats needed for majority',
    leadParty:
      lang === 'el'
        ? 'Πρώτο κόμμα'
        : 'Leading party',
    noMajority:
      lang === 'el'
        ? 'Κανένα κόμμα δεν φτάνει τις 29.'
        : 'No single party reaches 29.',
    twoPartyOk:
      lang === 'el'
        ? 'Συνασπισμός 2 μεγαλύτερων κομμάτων: ≥29, βιώσιμο.'
        : 'Top-two coalition: ≥29 seats, viable.',
    twoPartyShort:
      lang === 'el'
        ? 'Συνασπισμός 2 μεγαλύτερων κομμάτων: <29, χρειάζονται 3 κόμματα.'
        : 'Top-two coalition: <29 seats, needs a third party.',
    fragmented:
      lang === 'el'
        ? 'Κατακερματισμένη Βουλή. Σχηματισμός κυβέρνησης απαιτεί 3+ κόμματα.'
        : 'Fragmented parliament. Forming a government takes 3+ parties.'
  });

  function pickShort(p: { shortName: { en: string; el: string } }) {
    return p.shortName[lang] ?? p.shortName.en;
  }

  function partyColour(pid: PartyId | null): string {
    if (!pid) return 'var(--color-rule-strong)';
    return getParty(pid).colour;
  }

  function isLightFill(hex: string): boolean {
    const c = hex.replace('#', '');
    if (c.length !== 6) return false;
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    // Perceived luminance (Rec. 601). Pure white is 255; anything above ~220
    // disappears against the paper background and needs a darker stroke.
    return 0.299 * r + 0.587 * g + 0.114 * b > 220;
  }

  function seatStroke(pid: PartyId | null): string {
    if (!pid) return 'var(--color-paper)';
    return isLightFill(getParty(pid).colour)
      ? 'var(--color-ink-2)'
      : 'var(--color-paper)';
  }

  // Coalition analysis.
  const MAJORITY = 29;
  const coalitionStatus = $derived.by(() => {
    const sorted = [...result.perParty].sort((a, b) => b.seats - a.seats);
    if (sorted.length === 0) return { kind: 'fragmented' as const };
    const top1 = sorted[0]?.seats ?? 0;
    const top2 = top1 + (sorted[1]?.seats ?? 0);
    if (top1 >= MAJORITY)
      return { kind: 'single' as const, party: sorted[0]!.partyId };
    if (top2 >= MAJORITY)
      return {
        kind: 'two' as const,
        a: sorted[0]!.partyId,
        b: sorted[1]!.partyId
      };
    return { kind: 'fragmented' as const };
  });

  void PARTIES; // ensure tree-shake keeps PARTIES referenced if needed
</script>

<section class="wrap">
  <header class="head">
    <h3>{txt.title}</h3>
    <p class="subtitle">
      <strong class="num">{totalSeatsAwarded}</strong>
      <span class="muted">{txt.seatsOf}</span>
      <strong class="num">{result.totalSeats}</strong>
      <span class="muted">{txt.seats}</span>
    </p>
  </header>

  <div class="chart">
    <svg viewBox="0 0 100 55" role="img" aria-label={txt.title}>
      <!-- Hemicycle baseline rule -->
      <line x1="6" y1="49" x2="94" y2="49" stroke="var(--color-rule)" stroke-width="0.3" />
      {#each seats as seat, i (i)}
        <circle
          cx={seat.x}
          cy={seat.y}
          r="1.7"
          fill={partyColour(seat.partyId)}
          stroke={seatStroke(seat.partyId)}
          stroke-width="0.3"
        />
      {/each}
      <!-- Majority marker -->
      <line
        x1="50" y1="2" x2="50" y2="49"
        stroke="var(--color-fact)"
        stroke-width="0.3"
        stroke-dasharray="0.6 0.6"
      />
      <text x="50.5" y="4" fill="var(--color-fact)" font-size="2.2" font-family="var(--font-sans)">
        {MAJORITY}
      </text>
    </svg>
  </div>

  <!-- ---- Legend ---- -->
  <div class="legend" aria-label={txt.legend}>
    {#each orderedSeats as row (row.partyId)}
      {@const party = getParty(row.partyId)}
      <div class="lg">
        <span class="lg-swatch" style:background-color={party.colour} aria-hidden="true"></span>
        <span class="lg-name">{pickShort(party)}</span>
        <span class="lg-seats">{numFmt.format(row.seats)}</span>
      </div>
    {/each}
  </div>

  <!-- ---- Coalition callout ---- -->
  <aside class="coalition">
    <p class="coalition-eyebrow">{txt.coalitionTitle}</p>
    {#if coalitionStatus.kind === 'single'}
      <p class="coalition-body">
        <strong>{pickShort(getParty(coalitionStatus.party))}</strong>
        {lang === 'el'
          ? ' σχηματίζει αυτοδύναμη κυβέρνηση (≥29 έδρες).'
          : ' commands an outright majority (≥29 seats).'}
      </p>
    {:else if coalitionStatus.kind === 'two'}
      <p class="coalition-body">
        <strong>{pickShort(getParty(coalitionStatus.a))}</strong>
        + <strong>{pickShort(getParty(coalitionStatus.b))}</strong>
        {lang === 'el' ? ' ≥ 29 έδρες, βιώσιμος δι-κομματικός συνασπισμός.' : ' ≥ 29 seats, a two-party coalition could pass legislation.'}
      </p>
    {:else}
      <p class="coalition-body">{txt.fragmented}</p>
    {/if}
    <p class="coalition-foot muted">{txt.needForMajority}</p>
  </aside>
</section>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--sp-3);
  }
  .head h3 {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--fs-400);
    color: var(--color-ink);
  }
  .subtitle {
    margin: 0;
    font-size: var(--fs-100);
  }
  .num {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: var(--color-ink);
  }
  .muted { color: var(--color-ink-3); }

  .chart {
    background: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    padding: var(--sp-4);
  }
  .chart svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: var(--sp-2) var(--sp-4);
  }
  .lg {
    display: grid;
    grid-template-columns: 12px 1fr auto;
    gap: var(--sp-2);
    align-items: center;
    padding: var(--sp-2) var(--sp-3);
    background: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-2);
    font-size: var(--fs-75);
  }
  .lg-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    border: 1px solid var(--color-rule-strong);
  }
  .lg-name {
    color: var(--color-ink);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lg-seats {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: var(--color-ink);
  }

  .coalition {
    background: var(--color-info-soft);
    border: 1px solid color-mix(in oklab, var(--color-info) 18%, transparent);
    border-left: 3px solid var(--color-info);
    border-radius: var(--radius-3);
    padding: var(--sp-4) var(--sp-5);
  }
  .coalition-eyebrow {
    margin: 0 0 var(--sp-2);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-info);
    font-weight: 600;
  }
  .coalition-body {
    margin: 0;
    font-size: var(--fs-100);
    color: var(--color-ink);
    max-width: 60ch;
  }
  .coalition-foot {
    margin: var(--sp-2) 0 0;
    font-size: var(--fs-50);
    letter-spacing: var(--tracking-wide);
  }
</style>
