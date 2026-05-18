<script lang="ts">
  import type { Lang } from '$data/types';
  import { DISTRICTS } from '$data/districts';
  import { localizedName } from '$i18n/dict';

  type Props = {
    lang: Lang;
  };

  let { lang }: Props = $props();

  function fmtVoters(v: number): string {
    return new Intl.NumberFormat(lang === 'el' ? 'el-CY' : 'en-GB').format(v);
  }

  function deltaSign(diff: number): string {
    if (diff > 0) return `+${diff}`;
    if (diff < 0) return `${diff}`;
    return '0';
  }

  const L = $derived({
    caption:
      lang === 'el'
        ? 'Επαρχίες, έδρες (2021 vs 2026) και χρώματα ψηφοδελτίου'
        : 'Districts, seats (2021 vs 2026) and ballot colours',
    district: lang === 'el' ? 'Επαρχία' : 'District',
    seats21: lang === 'el' ? 'Έδρες 2021' : 'Seats 2021',
    seats26: lang === 'el' ? 'Έδρες 2026' : 'Seats 2026',
    delta: lang === 'el' ? 'Μεταβολή' : 'Change',
    voters: lang === 'el' ? 'Εγγεγραμμένοι 2026' : 'Voters 2026',
    ballot: lang === 'el' ? 'Ψηφοδέλτιο' : 'Ballot',
    crosses: lang === 'el' ? 'Σταυροί' : 'Crosses',
    total: lang === 'el' ? 'Σύνολο' : 'Total'
  });

  const totals = $derived({
    seats21: DISTRICTS.reduce((s, d) => s + d.seats2021, 0),
    seats26: DISTRICTS.reduce((s, d) => s + d.seats2026, 0),
    voters: DISTRICTS.reduce((s, d) => s + d.registeredVoters2026, 0),
    crosses: DISTRICTS.reduce((s, d) => s + d.preferenceCrosses, 0)
  });
</script>

<div class="dt-wrap">
  <table class="district-table">
    <caption>{L.caption}</caption>
    <thead>
      <tr>
        <th scope="col">{L.district}</th>
        <th scope="col" class="num">{L.seats21}</th>
        <th scope="col" class="num">{L.seats26}</th>
        <th scope="col" class="num">{L.delta}</th>
        <th scope="col" class="num">{L.voters}</th>
        <th scope="col">{L.ballot}</th>
        <th scope="col" class="num">{L.crosses}</th>
      </tr>
    </thead>
    <tbody>
      {#each DISTRICTS as d (d.id)}
        {@const diff = d.seats2026 - d.seats2021}
        <tr>
          <th scope="row">{localizedName(d, lang)}</th>
          <td class="num">{d.seats2021}</td>
          <td class="num"><strong>{d.seats2026}</strong></td>
          <td
            class="num delta"
            class:delta--pos={diff > 0}
            class:delta--neg={diff < 0}
          >{deltaSign(diff)}</td>
          <td class="num">{fmtVoters(d.registeredVoters2026)}</td>
          <td class="ballot">
            <span
              class="ballot-swatch"
              style="background-color: {d.ballotColour};"
              aria-hidden="true"
            ></span>
            <span>{localizedName(d.ballotColourLabel, lang)}</span>
          </td>
          <td class="num">{d.preferenceCrosses}</td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <th scope="row">{L.total}</th>
        <td class="num">{totals.seats21}</td>
        <td class="num"><strong>{totals.seats26}</strong></td>
        <td class="num">0</td>
        <td class="num">{fmtVoters(totals.voters)}</td>
        <td></td>
        <td class="num">{totals.crosses}</td>
      </tr>
    </tfoot>
  </table>
</div>

<style>
  .dt-wrap {
    width: 100%;
    overflow-x: auto;
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    background-color: var(--color-paper);
  }

  .district-table {
    width: 100%;
    min-width: 600px;
    border-collapse: separate;
    border-spacing: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    color: var(--color-ink-2);
  }

  caption {
    text-align: left;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    padding: var(--sp-3) var(--sp-4);
    background-color: var(--color-paper-2);
    border-bottom: 1px solid var(--color-rule);
  }

  thead th {
    text-align: left;
    padding: var(--sp-2) var(--sp-3);
    background-color: var(--color-paper-2);
    color: var(--color-ink);
    font-weight: 600;
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    border-bottom: 2px solid var(--color-rule-strong);
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
  }

  tfoot td {
    border-top: 2px solid var(--color-rule-strong);
    border-bottom: 0;
    background-color: var(--color-paper-2);
  }

  tfoot th[scope='row'] {
    border-top: 2px solid var(--color-rule-strong);
    border-bottom: 0;
    background-color: var(--color-paper-2);
  }

  .num {
    text-align: right;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }

  .delta--pos {
    color: var(--color-positive);
    font-weight: 600;
  }
  .delta--neg {
    color: var(--color-fact);
    font-weight: 600;
  }

  .ballot {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    white-space: nowrap;
  }

  .ballot-swatch {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: var(--radius-1);
    border: 1px solid rgba(20, 24, 31, 0.2);
    flex-shrink: 0;
  }
</style>
