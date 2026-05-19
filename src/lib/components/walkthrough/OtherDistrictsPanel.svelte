<script lang="ts">
  import type { DistrictId, Lang, PartyId } from '$data/types';
  import { getDistrict } from '$data/districts';
  import { getParty } from '$data/parties';
  import { localizedName } from '$i18n/dict';
  import { RESULTS_2021, VALID_VOTES_BY_DISTRICT_2021 } from '$data/results-2021';

  type Props = {
    lang: Lang;
  };

  let { lang }: Props = $props();

  // Parties that cleared the 3.6 % national threshold in 2021.
  const QUALIFYING: PartyId[] = ['DISY', 'AKEL', 'DIKO', 'EDEK', 'KOSP', 'DIPA', 'ELAM'];

  // Districts shown here — Nicosia is already covered in step 2.
  const DIST_IDS: DistrictId[] = ['LIM', 'FAM', 'LAR', 'PAF', 'KYR'];

  type PartyRow = {
    partyId: PartyId;
    votes: number;
    seats: number;
    unused: number;
  };

  type DistrictBlock = {
    districtId: DistrictId;
    seats: number;
    validVotes: number;
    quota: number;
    firstDistTotal: number;
    rows: PartyRow[];
    maxUnusedPartyId: PartyId | null;
  };

  function computeBlock(districtId: DistrictId): DistrictBlock {
    const district = getDistrict(districtId);
    const seats = district.seats2021;
    const validVotes = VALID_VOTES_BY_DISTRICT_2021[districtId];
    const quota = seats > 0 ? Math.floor(validVotes / seats) : 0;

    let firstDistTotal = 0;
    let maxUnused = -Infinity;
    let maxUnusedPartyId: PartyId | null = null;
    const rows: PartyRow[] = QUALIFYING.map((pid) => {
      const entry = RESULTS_2021.find((r) => r.partyId === pid);
      const votes = entry?.perDistrict[districtId]?.votes ?? 0;
      const won = quota > 0 ? Math.floor(votes / quota) : 0;
      const unused = Math.max(0, votes - won * quota);
      firstDistTotal += won;
      if (unused > maxUnused) {
        maxUnused = unused;
        maxUnusedPartyId = pid;
      }
      return { partyId: pid, votes, seats: won, unused };
    });
    rows.sort((a, b) => b.votes - a.votes);
    return {
      districtId,
      seats,
      validVotes,
      quota,
      firstDistTotal,
      rows,
      maxUnusedPartyId
    };
  }

  const blocks = $derived<DistrictBlock[]>(DIST_IDS.map(computeBlock));

  function fmt(n: number): string {
    return new Intl.NumberFormat(lang === 'el' ? 'el-CY' : 'en-GB').format(n);
  }

  const L = $derived({
    eyebrow:
      lang === 'el'
        ? '1η κατανομή — Άλλες επαρχίες (2021)'
        : 'First distribution — other districts (2021)',
    title:
      lang === 'el'
        ? 'Κάθε επαρχία αφήνει τις δικές της αχρησιμοποίητες ψήφους'
        : 'Every district contributes its own unused votes',
    intro:
      lang === 'el'
        ? 'Η ίδια διαδικασία επαναλαμβάνεται στις άλλες πέντε επαρχίες. Οι ψήφοι που δεν «αγόρασαν» έδρα μπαίνουν, μαζί με αυτές της Λευκωσίας, στην εθνική δεξαμενή του 2ου σταδίου.'
        : 'The same procedure runs in the other five districts. Any votes that did not "buy" a seat join Nicosia\'s in the national pool used by the second distribution.',
    seats: lang === 'el' ? 'έδρες' : 'seats',
    quota: lang === 'el' ? 'μέτρο' : 'quota',
    valid: lang === 'el' ? 'έγκυροι' : 'valid',
    party: lang === 'el' ? 'Κόμμα' : 'Party',
    votes: lang === 'el' ? 'Ψήφοι' : 'Votes',
    seatsCol: lang === 'el' ? 'Έδρ.' : 'Sts',
    unused: lang === 'el' ? 'Αχρ.' : 'Unused',
    legendMax:
      lang === 'el'
        ? 'Έντονη απόχρωση = το κόμμα με τις περισσότερες αχρησιμοποίητες ψήφους στην επαρχία (όπου «προσγειώνεται» η αναδιανεμημένη του έδρα).'
        : 'Highlighted row = the party with the most unused votes in that district (where its reallocated seat lands).',
    sourceNote:
      lang === 'el'
        ? 'Πηγή: Υπουργείο Εσωτερικών — data.gov.cy «Επίσημα Αποτελέσματα Βουλευτικών Εκλογών 2021». Αθροιστική κατανομή ανά εκλογική επαρχία × κόμμα.'
        : 'Source: Cyprus Ministry of Interior — data.gov.cy "Official Results, 2021 Parliamentary Elections". Aggregated per electoral district × party.'
  });
</script>

<section class="other-panel" aria-labelledby="other-districts-title">
  <header class="op-header">
    <p class="op-eyebrow">{L.eyebrow}</p>
    <h4 id="other-districts-title" class="op-title">{L.title}</h4>
    <p class="op-intro">{L.intro}</p>
  </header>

  <div class="op-grid">
    {#each blocks as b (b.districtId)}
      {@const district = getDistrict(b.districtId)}
      <article class="card" aria-labelledby={`card-${b.districtId}-title`}>
        <header class="card-head">
          <h5 id={`card-${b.districtId}-title`} class="card-title">
            {localizedName(district.name, lang)}
          </h5>
          <p class="card-meta">
            <span class="meta-pair">
              <span class="meta-num">{b.seats}</span>
              <span class="meta-lab">{L.seats}</span>
            </span>
            <span class="meta-sep" aria-hidden="true">·</span>
            <span class="meta-pair">
              <span class="meta-num">{fmt(b.validVotes)}</span>
              <span class="meta-lab">{L.valid}</span>
            </span>
            <span class="meta-sep" aria-hidden="true">·</span>
            <span class="meta-pair">
              <span class="meta-lab">{L.quota}</span>
              <span class="meta-num meta-num--accent">{fmt(b.quota)}</span>
            </span>
          </p>
        </header>

        <table class="mini-table">
          <thead>
            <tr>
              <th scope="col">{L.party}</th>
              <th scope="col" class="num">{L.votes}</th>
              <th scope="col" class="num">{L.seatsCol}</th>
              <th scope="col" class="num unused-head">{L.unused}</th>
            </tr>
          </thead>
          <tbody>
            {#each b.rows as r (r.partyId)}
              {@const p = getParty(r.partyId)}
              {@const isMax = r.partyId === b.maxUnusedPartyId}
              <tr class:row--max={isMax}>
                <th scope="row">
                  <span class="row-party">
                    <span class="row-swatch" style="background-color: {p.colour};" aria-hidden="true"></span>
                    {localizedName(p.shortName, lang)}
                  </span>
                </th>
                <td class="num">{fmt(r.votes)}</td>
                <td class="num">{r.seats}</td>
                <td class="num unused-cell">{fmt(r.unused)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </article>
    {/each}
  </div>

  <p class="op-legend">{L.legendMax}</p>
  <p class="op-source">{L.sourceNote}</p>
</section>

<style>
  .other-panel {
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    padding: var(--sp-5);
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .op-eyebrow {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-fact);
    font-weight: 700;
  }

  .op-title {
    margin: var(--sp-1) 0 0;
    font-family: var(--font-display);
    font-size: var(--fs-300);
    font-weight: 600;
    line-height: var(--lh-tight);
    color: var(--color-ink);
    text-wrap: balance;
  }

  .op-intro {
    margin: var(--sp-1) 0 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
    max-width: 64ch;
  }

  .op-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--sp-3);
  }

  .card {
    background-color: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-2);
    padding: var(--sp-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    min-width: 0;
  }

  .card-head {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
  }

  .card-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--fs-200);
    font-weight: 600;
    color: var(--color-ink);
    line-height: 1.2;
  }

  .card-meta {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--sp-1) var(--sp-2);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    color: var(--color-ink-3);
  }

  .meta-pair {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
  }

  .meta-num {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    color: var(--color-ink);
    font-weight: 600;
  }

  .meta-num--accent {
    color: var(--color-fact);
  }

  .meta-lab {
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
  }

  .meta-sep {
    color: var(--color-ink-3);
  }

  .mini-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-sans);
    font-size: 12px;
  }

  .mini-table thead th {
    padding: 4px 6px;
    text-align: left;
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    border-bottom: 1px solid var(--color-rule);
    white-space: nowrap;
  }

  .mini-table tbody td,
  .mini-table tbody th {
    padding: 4px 6px;
    border-bottom: 1px solid var(--color-rule);
    text-align: left;
    color: var(--color-ink-2);
    font-weight: 400;
  }

  .mini-table tbody tr:last-child td,
  .mini-table tbody tr:last-child th {
    border-bottom: 0;
  }

  .mini-table tbody th[scope='row'] {
    color: var(--color-ink);
    font-weight: 600;
  }

  .num {
    text-align: right;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }

  .unused-head,
  .unused-cell {
    color: var(--color-fact);
    font-weight: 600;
  }

  .row--max .unused-cell {
    background-color: var(--color-fact-soft);
    color: var(--color-fact);
  }

  .row--max th[scope='row'] {
    box-shadow: inset 3px 0 0 var(--color-fact);
  }

  .row-party {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .row-swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    border: 1px solid rgba(20, 24, 31, 0.18);
    flex-shrink: 0;
  }

  .op-legend,
  .op-source {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-3);
  }

  .op-legend {
    padding-top: var(--sp-2);
    border-top: 1px dashed var(--color-rule);
  }
</style>
