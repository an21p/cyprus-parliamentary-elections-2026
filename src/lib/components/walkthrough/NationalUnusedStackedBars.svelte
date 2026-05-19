<script lang="ts">
  import type { DistrictId, Lang, PartyId } from '$data/types';
  import { getDistrict } from '$data/districts';
  import { getParty } from '$data/parties';
  import { localizedName } from '$i18n/dict';
  import { RESULTS_2021, VALID_VOTES_BY_DISTRICT_2021 } from '$data/results-2021';
  import { partyColour } from '$lib/theme/a11y.svelte';

  type Props = {
    lang: Lang;
  };

  let { lang }: Props = $props();

  // Parties that cleared the 3.6 % national threshold in 2021 and therefore
  // participate in the second distribution.
  const QUALIFYING: PartyId[] = ['DISY', 'AKEL', 'DIKO', 'EDEK', 'KOSP', 'DIPA', 'ELAM'];
  const ALL_DISTRICTS: DistrictId[] = ['NIC', 'LIM', 'FAM', 'LAR', 'PAF', 'KYR'];

  // District segment palette. Nicosia's official ballot is white — substituted
  // with a darker slate for visibility on a paper background.
  const DISTRICT_COLOUR: Record<DistrictId, string> = {
    NIC: '#94a3b8',
    LIM: '#facc15',
    FAM: '#3b82f6',
    LAR: '#ec4899',
    PAF: '#22c55e',
    KYR: '#f97316'
  };

  function districtUnused(districtId: DistrictId, partyId: PartyId): number {
    const district = getDistrict(districtId);
    const seats = district.seats2021;
    const validVotes = VALID_VOTES_BY_DISTRICT_2021[districtId];
    const quota = seats > 0 ? Math.floor(validVotes / seats) : 0;
    const entry = RESULTS_2021.find((r) => r.partyId === partyId);
    const votes = entry?.perDistrict[districtId]?.votes ?? 0;
    const won = quota > 0 ? Math.floor(votes / quota) : 0;
    return Math.max(0, votes - won * quota);
  }

  type Segment = { districtId: DistrictId; unused: number };
  type PartyTotal = {
    partyId: PartyId;
    total: number;
    segments: Segment[];
    largestDistrict: DistrictId;
  };

  const partyTotals = $derived<PartyTotal[]>(
    QUALIFYING.map((pid) => {
      const segments: Segment[] = ALL_DISTRICTS.map((did) => ({
        districtId: did,
        unused: districtUnused(did, pid)
      }));
      const total = segments.reduce((s, x) => s + x.unused, 0);
      const largestDistrict = segments
        .slice()
        .sort((a, b) => b.unused - a.unused)[0]?.districtId ?? 'NIC';
      return { partyId: pid, total, segments, largestDistrict };
    }).sort((a, b) => b.total - a.total)
  );

  const totalUnused = $derived(partyTotals.reduce((s, p) => s + p.total, 0));
  const maxTotal = $derived(Math.max(...partyTotals.map((p) => p.total), 1));

  // 56 seats total; 29 were filled in stage 1 from the official MOI breakdown,
  // leaving 27 for stages 2 & 3 (the second-distribution quota uses 27 — the
  // remaining-seats denominator — not just the headline "20" sometimes quoted).
  const STAGE2_SEATS = 27;
  const STAGE2_QUOTA = $derived(
    STAGE2_SEATS > 0 ? Math.floor(totalUnused / STAGE2_SEATS) : 0
  );

  function fmt(n: number): string {
    return new Intl.NumberFormat(lang === 'el' ? 'el-CY' : 'en-GB').format(n);
  }

  const L = $derived({
    eyebrow:
      lang === 'el'
        ? 'Εθνική δεξαμενή: αχρησιμοποίητες ψήφοι ανά κόμμα'
        : 'National pool: unused votes per party',
    title:
      lang === 'el'
        ? 'Όλες οι αχρησιμοποίητες ψήφοι από τις 6 επαρχίες'
        : 'Every district\'s unused votes, summed per party',
    intro:
      lang === 'el'
        ? 'Στη 2η κατανομή η Κύπρος αντιμετωπίζεται ως μία περιφέρεια. Η ράβδος κάθε κόμματος είναι το άθροισμα των αχρησιμοποίητων ψήφων του από τις έξι επαρχίες, οι ψήφοι με τις οποίες «αγοράζει» τις εθνικές έδρες.'
        : 'In the second distribution Cyprus is treated as a single constituency. Each party\'s bar is its national unused-vote total, decomposed into the six district contributions: these are the votes the party "spends" to buy national-pool seats.',
    legendNic: lang === 'el' ? 'Λευκωσία' : 'Nicosia',
    legendLim: lang === 'el' ? 'Λεμεσός' : 'Limassol',
    legendFam: lang === 'el' ? 'Αμμόχωστος' : 'Famagusta',
    legendLar: lang === 'el' ? 'Λάρνακα' : 'Larnaca',
    legendPaf: lang === 'el' ? 'Πάφος' : 'Paphos',
    legendKyr: lang === 'el' ? 'Κερύνεια' : 'Kyrenia',
    totalLabel: lang === 'el' ? 'σύνολο' : 'total',
    quotaLine: (q: number, t: number) =>
      lang === 'el'
        ? `2ο μέτρο = ${fmt(t)} αχρ. ψήφοι ÷ ${STAGE2_SEATS} έδρες = ${fmt(q)}`
        : `Stage-2 quota = ${fmt(t)} unused votes ÷ ${STAGE2_SEATS} seats = ${fmt(q)}`,
    landsIn:
      lang === 'el'
        ? 'προσγειώνεται:'
        : 'lands in:',
    note:
      lang === 'el'
        ? 'Πηγή: επίσημα αποτελέσματα ΥΠΕΣ 2021 (data.gov.cy). Κάθε τμήμα είναι αναλογικό του εθνικού αχρ. συνόλου του κόμματος. Το «προσγειώνεται» δείχνει την επαρχία όπου το κόμμα είχε τη μεγαλύτερη αχρ. ψήφο, και επομένως όπου τοποθετείται η αναδιανεμημένη του έδρα.'
        : 'Source: official MOI 2021 results (data.gov.cy). Each segment is proportional to the party\'s national unused-vote total. "Lands in" is the district where the party had the largest unused vote, and therefore where its reallocated seat is placed.'
  });

  const districtLabel: Record<DistrictId, string> = $derived({
    NIC: L.legendNic,
    LIM: L.legendLim,
    FAM: L.legendFam,
    LAR: L.legendLar,
    PAF: L.legendPaf,
    KYR: L.legendKyr
  });
</script>

<section class="nat-panel" aria-labelledby="national-unused-title">
  <header class="np-header">
    <p class="np-eyebrow">{L.eyebrow}</p>
    <h4 id="national-unused-title" class="np-title">{L.title}</h4>
    <p class="np-intro">{L.intro}</p>
  </header>

  <ul class="legend" role="list" aria-label="District colour key">
    {#each ALL_DISTRICTS as did (did)}
      <li class="legend-item">
        <span class="legend-swatch" style="background-color: {DISTRICT_COLOUR[did]};" aria-hidden="true"></span>
        <span class="legend-label">{districtLabel[did]}</span>
      </li>
    {/each}
  </ul>

  <ul class="bars" role="list">
    {#each partyTotals as p (p.partyId)}
      {@const party = getParty(p.partyId)}
      {@const widthPct = (p.total / maxTotal) * 100}
      {@const landingDistrict = getDistrict(p.largestDistrict)}
      <li class="bar-row">
        <div class="bar-meta">
          <span class="bar-party">
            <span class="bar-swatch" style="background-color: {partyColour(party.id)};" aria-hidden="true"></span>
            <span class="bar-party-name">{localizedName(party.shortName, lang)}</span>
          </span>
          <span class="bar-total">
            <span class="bar-total-num">{fmt(p.total)}</span>
            <span class="bar-total-lab">{L.totalLabel}</span>
          </span>
        </div>
        <div
          class="bar-track"
          role="img"
          aria-label={`${localizedName(party.shortName, lang)}: ${fmt(p.total)} unused votes nationally`}
          style="width: {widthPct.toFixed(2)}%;"
        >
          {#each p.segments as seg (seg.districtId)}
            {#if seg.unused > 0}
              {@const segPct = (seg.unused / p.total) * 100}
              <span
                class="bar-seg"
                style="width: {segPct.toFixed(4)}%; background-color: {DISTRICT_COLOUR[seg.districtId]};"
                title={`${districtLabel[seg.districtId]}: ${fmt(seg.unused)}`}
                aria-label={`${districtLabel[seg.districtId]}: ${fmt(seg.unused)}`}
              ></span>
            {/if}
          {/each}
        </div>
        <p class="bar-lands">
          <span class="bar-lands-dot" style="background-color: {DISTRICT_COLOUR[p.largestDistrict]};" aria-hidden="true"></span>
          <span>{L.landsIn} <strong>{localizedName(landingDistrict.name, lang)}</strong></span>
        </p>
      </li>
    {/each}
  </ul>

  <p class="np-quota">{L.quotaLine(STAGE2_QUOTA, totalUnused)}</p>
  <p class="np-note">{L.note}</p>
</section>

<style>
  .nat-panel {
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    padding: var(--sp-5);
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .np-eyebrow {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-fact);
    font-weight: 700;
  }

  .np-title {
    margin: var(--sp-1) 0 0;
    font-family: var(--font-display);
    font-size: var(--fs-300);
    font-weight: 600;
    line-height: var(--lh-tight);
    color: var(--color-ink);
    text-wrap: balance;
  }

  .np-intro {
    margin: var(--sp-1) 0 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
    max-width: 64ch;
  }

  .legend {
    list-style: none;
    margin: 0;
    padding: var(--sp-2) var(--sp-3);
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-1) var(--sp-3);
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-2);
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-sans);
    font-size: 11px;
    color: var(--color-ink-2);
  }

  .legend-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    border: 1px solid rgba(20, 24, 31, 0.18);
  }

  .legend-label {
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    font-size: 10px;
    font-weight: 600;
    color: var(--color-ink-3);
  }

  .bars {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .bar-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .bar-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--sp-2);
  }

  .bar-party {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    color: var(--color-ink);
    font-weight: 600;
  }

  .bar-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    border: 1px solid rgba(20, 24, 31, 0.18);
  }

  .bar-total {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
    font-family: var(--font-sans);
    color: var(--color-ink-3);
  }

  .bar-total-num {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-size: var(--fs-100);
    font-weight: 700;
    color: var(--color-ink);
  }

  .bar-total-lab {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
  }

  .bar-track {
    display: flex;
    height: 18px;
    background-color: var(--color-paper-3);
    border-radius: var(--radius-1);
    overflow: hidden;
    transition: width var(--dur-base) var(--ease-standard);
    min-width: 4px;
  }

  .bar-seg {
    display: block;
    height: 100%;
    transition: width var(--dur-base) var(--ease-standard);
  }

  .bar-seg + .bar-seg {
    border-left: 1px solid rgba(255, 255, 255, 0.7);
  }

  .bar-lands {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-sans);
    font-size: 11px;
    color: var(--color-ink-3);
  }

  .bar-lands strong {
    color: var(--color-ink);
    font-weight: 600;
  }

  .bar-lands-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    border: 1px solid rgba(20, 24, 31, 0.18);
  }

  .np-quota {
    margin: 0;
    padding: var(--sp-3);
    background-color: var(--color-fact-soft);
    border-left: 3px solid var(--color-fact);
    border-radius: var(--radius-2);
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-size: var(--fs-75);
    color: var(--color-ink);
    font-weight: 600;
  }

  .np-note {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-3);
    padding-top: var(--sp-2);
    border-top: 1px dashed var(--color-rule);
  }
</style>
