<script lang="ts">
  import type { Lang } from '$data/types';

  type Props = {
    lang: Lang;
  };

  let { lang }: Props = $props();

  const VALID_VOTES = 122347;
  const SEATS = 20;
  const QUOTA = 6117; // floor(122,347 / 20)

  function fmt(n: number): string {
    return new Intl.NumberFormat(lang === 'el' ? 'el-CY' : 'en-GB').format(n);
  }

  const L = $derived({
    eyebrow: lang === 'el' ? 'Νicosia 2021 - Εκλογικό Μέτρο' : 'Nicosia 2021 - Electoral Quota',
    title:
      lang === 'el'
        ? 'Το «μέτρο» χωρίζει τους ψήφους σε ίσες θέσεις'
        : 'The "quota" splits valid votes into equal seat-slots',
    validVotes: lang === 'el' ? 'έγκυροι ψήφοι' : 'valid votes',
    seats: lang === 'el' ? 'έδρες' : 'seats',
    quota: lang === 'el' ? 'εκλογικό μέτρο' : 'electoral quota',
    intro:
      lang === 'el'
        ? 'Στην Επαρχία Λευκωσίας το 2021 υπήρχαν 122.347 έγκυροι ψήφοι για 20 έδρες. Το «μέτρο» (Hare quota) είναι ο ακέραιος της διαίρεσης.'
        : 'Nicosia in 2021 had 122,347 valid votes for 20 seats. The quota (Hare, truncated) is the integer part of the division.',
    barLabel: lang === 'el' ? '20 ίσες "θέσεις" των 6.117 ψήφων' : '20 equal "seat" slots of 6,117 votes',
    note:
      lang === 'el'
        ? 'Κάθε λίστα παίρνει στην πρώτη κατανομή τόσες έδρες όσες χωράει ο αριθμός ψήφων της στο μέτρο των 6.117. Οι ψήφοι που περισσεύουν λέγονται «αχρησιμοποίητες».'
        : 'In the first distribution each list wins as many seats as its vote total can buy at 6,117 each. The leftover is called "unused votes".'
  });

  const slots = Array.from({ length: SEATS }, (_, i) => i);
</script>

<section class="quota-panel" aria-labelledby="quota-panel-title">
  <header class="qp-header">
    <p class="qp-eyebrow">{L.eyebrow}</p>
    <h4 id="quota-panel-title" class="qp-title">{L.title}</h4>
    <p class="qp-intro">{L.intro}</p>
  </header>

  <div class="qp-eq" aria-label={`${fmt(VALID_VOTES)} / ${SEATS} = ${fmt(QUOTA)}`}>
    <div class="eq-term">
      <p class="eq-value">{fmt(VALID_VOTES)}</p>
      <p class="eq-label">{L.validVotes}</p>
    </div>
    <p class="eq-op" aria-hidden="true">÷</p>
    <div class="eq-term">
      <p class="eq-value">{SEATS}</p>
      <p class="eq-label">{L.seats}</p>
    </div>
    <p class="eq-op" aria-hidden="true">=</p>
    <div class="eq-term eq-term--accent">
      <p class="eq-value">{fmt(QUOTA)}</p>
      <p class="eq-label">{L.quota}</p>
    </div>
  </div>

  <div class="qp-bar" role="img" aria-label={L.barLabel}>
    {#each slots as i (i)}
      <div class="slot" style="width: {(100 / SEATS).toFixed(4)}%;">
        <span class="slot-num">{i + 1}</span>
      </div>
    {/each}
  </div>
  <p class="qp-bar-caption">{L.barLabel}</p>

  <p class="qp-note">{L.note}</p>
</section>

<style>
  .quota-panel {
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    padding: var(--sp-5);
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .qp-eyebrow {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-fact);
    font-weight: 700;
  }

  .qp-title {
    margin: 0;
    font-family: var(--font-display);
    font-variation-settings: var(--fvs-display-md);
    font-size: var(--fs-300);
    font-weight: 600;
    line-height: var(--lh-tight);
    letter-spacing: var(--tracking-snug);
    color: var(--color-ink);
    text-wrap: balance;
  }

  .qp-intro {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
  }

  .qp-eq {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--sp-4);
    padding: var(--sp-4);
    background-color: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-2);
  }

  .eq-term {
    text-align: center;
    min-width: 90px;
  }

  .eq-value {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
    line-height: 1;
    color: var(--color-ink);
    font-variant-numeric: tabular-nums lining-nums;
    letter-spacing: var(--tracking-tight);
  }

  .eq-term--accent .eq-value {
    color: var(--color-fact);
  }

  .eq-label {
    margin: var(--sp-1) 0 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
  }

  .eq-op {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 1.75rem;
    color: var(--color-ink-3);
    line-height: 1;
  }

  .qp-bar {
    display: flex;
    width: 100%;
    height: 36px;
    border: 1px solid var(--color-rule-strong);
    border-radius: var(--radius-2);
    overflow: hidden;
    background-color: var(--color-paper);
  }

  .slot {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid var(--color-rule);
    background-color: var(--color-accent-soft);
    color: var(--color-accent);
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    transition: background-color var(--dur-fast) var(--ease-standard);
  }

  .slot:last-child {
    border-right: 0;
  }

  .slot-num {
    font-variant-numeric: tabular-nums;
  }

  .qp-bar-caption {
    margin: 0;
    text-align: center;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    color: var(--color-ink-3);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
  }

  .qp-note {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
    padding-top: var(--sp-3);
    border-top: 1px solid var(--color-rule);
  }
</style>
