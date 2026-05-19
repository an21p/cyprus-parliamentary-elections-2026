<script lang="ts">
  import type { Lang, PartyId } from '$data/types';
  import { getParty } from '$data/parties';
  import { localizedName } from '$i18n/dict';
  import { partyColour } from '$lib/theme/a11y.svelte';

  type Props = {
    lang: Lang;
  };

  let { lang }: Props = $props();

  const QUOTA = 6117;

  // Rows drawn verbatim from §1.7 (Nicosia 2021 district votes).
  type Row = { partyId: PartyId; votes: number };

  const ROWS: Row[] = [
    { partyId: 'DISY', votes: 31163 },
    { partyId: 'AKEL', votes: 25770 },
    { partyId: 'DIKO', votes: 13449 },
    { partyId: 'EDEK', votes: 9061 },
    { partyId: 'KOSP', votes: 8386 },
    { partyId: 'DIPA', votes: 8232 },
    { partyId: 'ELAM', votes: 7486 }
  ];

  type ComputedRow = Row & { seats: number; unused: number };

  const computed = $derived<ComputedRow[]>(
    ROWS.map((r) => {
      const seats = Math.floor(r.votes / QUOTA);
      return { ...r, seats, unused: r.votes - seats * QUOTA };
    })
  );

  const totals = $derived({
    votes: computed.reduce((s, r) => s + r.votes, 0),
    seats: computed.reduce((s, r) => s + r.seats, 0),
    unused: computed.reduce((s, r) => s + r.unused, 0)
  });

  function fmt(n: number): string {
    return new Intl.NumberFormat(lang === 'el' ? 'el-CY' : 'en-GB').format(n);
  }

  const L = $derived({
    caption:
      lang === 'el'
        ? 'Πρώτη κατανομή στην Επαρχία Λευκωσίας (2021): μέτρο 6.117 ψήφων'
        : 'First distribution in Nicosia district (2021): quota 6,117 votes',
    party: lang === 'el' ? 'Κόμμα' : 'Party',
    votes: lang === 'el' ? 'Ψήφοι' : 'Votes',
    seats:
      lang === 'el' ? 'Έδρες (⌊ψήφοι ÷ 6.117⌋)' : 'Seats (⌊votes ÷ 6,117⌋)',
    unused: lang === 'el' ? 'Αχρησιμοποίητες ψήφοι' : 'Unused votes',
    total: lang === 'el' ? 'Σύνολο' : 'Total',
    note:
      lang === 'el'
        ? 'Σύνολο εδρών 1ης κατανομής: 15 από 20. Οι υπόλοιπες 5 αποδίδονται από την εθνική δεξαμενή στο 2ο/3ο στάδιο.'
        : 'First-distribution total: 15 of 20 seats. The remaining 5 are filled from the national pool in stages 2 and 3.'
  });
</script>

<div class="fdt-wrap">
  <table class="fdt">
    <caption>{L.caption}</caption>
    <thead>
      <tr>
        <th scope="col">{L.party}</th>
        <th scope="col" class="num">{L.votes}</th>
        <th scope="col" class="num">{L.seats}</th>
        <th scope="col" class="num unused-head">{L.unused}</th>
      </tr>
    </thead>
    <tbody>
      {#each computed as r (r.partyId)}
        {@const p = getParty(r.partyId)}
        <tr>
          <th scope="row">
            <span class="party">
              <span class="swatch" style="background-color: {partyColour(p.id)};" aria-hidden="true"></span>
              {localizedName(p.shortName, lang)}
            </span>
          </th>
          <td class="num">{fmt(r.votes)}</td>
          <td class="num">{r.seats}</td>
          <td class="num unused-cell">{fmt(r.unused)}</td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <th scope="row">{L.total}</th>
        <td class="num">{fmt(totals.votes)}</td>
        <td class="num">{totals.seats}</td>
        <td class="num unused-cell">{fmt(totals.unused)}</td>
      </tr>
    </tfoot>
  </table>
  <p class="fdt-note">{L.note}</p>
</div>

<style>
  .fdt-wrap {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .fdt {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    overflow: hidden;
  }

  caption {
    text-align: left;
    padding: var(--sp-3) var(--sp-4);
    background-color: var(--color-paper-2);
    border-bottom: 1px solid var(--color-rule);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
  }

  thead th {
    padding: var(--sp-2) var(--sp-3);
    background-color: var(--color-paper-2);
    color: var(--color-ink);
    font-weight: 600;
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    border-bottom: 2px solid var(--color-rule-strong);
    text-align: left;
    white-space: nowrap;
  }

  tbody td,
  tbody th,
  tfoot td,
  tfoot th {
    padding: var(--sp-2) var(--sp-3);
    border-bottom: 1px solid var(--color-rule);
    text-align: left;
    font-weight: 400;
    color: var(--color-ink-2);
  }

  tbody th[scope='row'] {
    color: var(--color-ink);
    font-weight: 600;
  }

  tfoot th[scope='row'] {
    color: var(--color-ink);
    font-weight: 600;
    border-top: 2px solid var(--color-rule-strong);
    background-color: var(--color-paper-2);
  }
  tfoot td {
    border-top: 2px solid var(--color-rule-strong);
    background-color: var(--color-paper-2);
    border-bottom: 0;
  }

  .num {
    text-align: right;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }

  .unused-head,
  .unused-cell {
    background-color: var(--color-fact-soft);
    color: var(--color-fact);
    font-weight: 600;
  }

  .unused-cell {
    color: var(--color-ink);
  }

  .party {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
  }

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: var(--radius-1);
    border: 1px solid rgba(20, 24, 31, 0.18);
  }

  .fdt-note {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-3);
  }
</style>
