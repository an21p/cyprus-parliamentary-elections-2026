<script lang="ts">
  import type { Lang } from '$i18n/dict';
  import type { ThirdDistributionTrace } from '$data/types';
  import { getParty } from '$data/parties';
  import { THRESHOLDS } from '$data/thresholds';
  import { partyColour } from '$lib/theme/a11y.svelte';

  type Props = {
    trace: ThirdDistributionTrace;
    lang: Lang;
  };
  let { trace, lang }: Props = $props();

  const localeForNumbers = $derived(lang === 'el' ? 'el-CY' : 'en-CY');
  const numFmt = $derived(new Intl.NumberFormat(localeForNumbers));

  const totalAwarded = $derived(
    trace.perParty.reduce((a, p) => a + p.seatsWon, 0)
  );

  const txt = $derived({
    intro:
      lang === 'el'
        ? `Στην 3η κατανομή κατανέμονται τυχόν εναπομείνασες έδρες σε κόμματα που ξεπέρασαν το ${THRESHOLDS.residual.toString().replace('.', ',')}% πανεθνικά.`
        : `Stage 3 hands out any seats still vacant to parties above ${THRESHOLDS.residual.toFixed(1)} % nationally.`,
    none:
      lang === 'el'
        ? 'Καμία υπολειπόμενη έδρα σε αυτή τη ροή· τα στάδια 1 και 2 γέμισαν τη Βουλή.'
        : 'No residual seats this allocation; stages 1 and 2 filled the parliament.',
    quals:
      lang === 'el' ? 'Δικαιούνται' : 'Eligible parties',
    remaining: lang === 'el' ? 'Υπολ. ψήφοι' : 'Remaining votes',
    seats: lang === 'el' ? 'Νέες έδρες' : 'Seats won here',
    totalAwarded:
      lang === 'el'
        ? `${totalAwarded} από ${trace.seatsRemaining} έδρες`
        : `${totalAwarded} of ${trace.seatsRemaining} seats placed`
  });

  const empty = $derived(trace.seatsRemaining === 0 || trace.perParty.length === 0);
</script>

<section class="wrap">
  <p class="intro">{txt.intro}</p>

  {#if empty}
    <p class="empty">{txt.none}</p>
  {:else}
    <header class="head">
      <h4>{txt.quals}</h4>
      <span class="muted">{txt.totalAwarded}</span>
    </header>

    <table class="alloc">
      <thead>
        <tr>
          <th>{lang === 'el' ? 'Κόμμα' : 'Party'}</th>
          <th class="num-col">{txt.remaining}</th>
          <th class="num-col">{txt.seats}</th>
        </tr>
      </thead>
      <tbody>
        {#each trace.perParty as row (row.partyId)}
          {@const party = getParty(row.partyId)}
          <tr class:zero={row.seatsWon === 0}>
            <td>
              <span class="swatch" style:background-color={partyColour(party.id)} aria-hidden="true"></span>
              <span>{party.shortName[lang] ?? party.shortName.en}</span>
            </td>
            <td class="num-col">{numFmt.format(Math.max(0, row.remainingUnusedVotes))}</td>
            <td class="num-col"><strong>{row.seatsWon}</strong></td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>

<style>
  .wrap {
    padding: var(--sp-4) var(--sp-5);
    background: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }
  .intro {
    margin: 0;
    font-size: var(--fs-100);
    color: var(--color-ink-2);
    max-width: 60ch;
  }
  .empty {
    margin: 0;
    padding: var(--sp-4) var(--sp-5);
    background: var(--color-paper-2);
    border: 1px dashed var(--color-rule-strong);
    border-radius: var(--radius-3);
    color: var(--color-ink-3);
    font-size: var(--fs-75);
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--sp-3);
  }
  .head h4 {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--fs-300);
    color: var(--color-ink);
  }
  .muted { color: var(--color-ink-3); font-size: var(--fs-75); }

  .alloc {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--fs-75);
  }
  .alloc th,
  .alloc td {
    padding: var(--sp-2) var(--sp-3);
    border-bottom: 1px solid var(--color-rule);
    text-align: left;
  }
  .alloc th {
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    font-weight: 600;
  }
  .num-col {
    text-align: right;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }
  tr.zero td { color: var(--color-ink-3); }
  .swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    display: inline-block;
    margin-right: var(--sp-2);
    vertical-align: baseline;
  }
</style>
