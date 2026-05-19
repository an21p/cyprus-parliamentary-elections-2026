<script lang="ts">
  import type { Lang } from '$i18n/dict';
  import { PARTIES } from '$data/parties';
  import { POLLS } from '$data/polls';
  import { simulatorState } from '$lib/simulator/state.svelte';
  import { partyColour } from '$lib/theme/a11y.svelte';
  import type { PartyId } from '$data/types';

  type Props = { lang: Lang };
  let { lang }: Props = $props();

  // Display-time formatting helpers.
  const localeForNumbers = $derived(lang === 'el' ? 'el-CY' : 'en-CY');
  const pctFmt = $derived(
    new Intl.NumberFormat(localeForNumbers, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    })
  );

  // Show all parties by default; user can collapse to "active only" if they want.
  let showAll = $state(true);

  const visibleParties = $derived.by(() =>
    showAll
      ? PARTIES
      : PARTIES.filter((p) => (simulatorState.shares[p.id] ?? 0) > 0)
  );

  // ---- Polls: build a (lang-aware) list for the dropdown ------------------
  let selectedPollIndex = $state<number>(-1);

  const finalPolls = $derived(
    POLLS.map((p, i) => ({
      index: i,
      label: `${p.pollster} · ${p.fieldworkEnd}`,
      pollster: p.pollster
    }))
  );

  // ---- Strings ------------------------------------------------------------
  const txt = $derived({
    title: lang === 'el' ? 'Ποσοστά κομμάτων' : 'Party vote shares',
    totalShare: lang === 'el' ? 'Συνολικό ποσοστό' : 'Total share entered',
    turnoutLabel: lang === 'el' ? 'Εκτιμώμενη προσέλευση' : 'Estimated turnout',
    turnoutNote:
      lang === 'el'
        ? 'Το 2021 ήταν 65,72%. Επηρεάζει το εκλογικό μέτρο.'
        : '2021 was 65.72 %. Affects each district’s electoral quota.',
    showAll: lang === 'el' ? 'Όλα τα κόμματα' : 'Show every party',
    activeOnly:
      lang === 'el' ? 'Μόνο όσα έχουν ψήφο' : 'Only parties with a share',
    presets: lang === 'el' ? 'Προ-ρυθμίσεις' : 'Presets',
    apply2021: lang === 'el' ? 'Πραγματικό 2021' : '2021 actual',
    reset: lang === 'el' ? 'Μηδενισμός' : 'Reset',
    pollLabel:
      lang === 'el'
        ? 'Φόρτωση δημοσκόπησης'
        : 'Load a recent poll',
    pollApply: lang === 'el' ? 'Εφαρμογή' : 'Apply',
    activePreset:
      lang === 'el' ? 'Ενεργή προ-ρύθμιση' : 'Active preset',
    warnOver:
      lang === 'el'
        ? 'Το άθροισμα υπερβαίνει το 100%. Οι ψήφοι θα κλιμακωθούν.'
        : 'Total exceeds 100 %. Votes will scale up accordingly.',
    warnUnder:
      lang === 'el'
        ? 'Το άθροισμα είναι κάτω από 100%. Οι υπόλοιπες ψήφοι θεωρούνται ότι πήγαν σε άλλα κόμματα/άκυρα.'
        : 'Below 100 %. The remainder is treated as "other / invalid".',
    approxNote:
      lang === 'el'
        ? 'Βασίζεται σε περιφερειακά μοτίβα 2021. Δεν αποτελεί πρόβλεψη.'
        : 'Based on regional vote-distribution patterns from 2021; not a forecast.'
  });

  function onApplyPoll(): void {
    if (selectedPollIndex >= 0) simulatorState.applyPoll(selectedPollIndex);
  }

  function fmtPct(n: number): string {
    return pctFmt.format(n);
  }

  function pickName(p: { name: { en: string; el: string } }) {
    return p.name[lang] ?? p.name.en;
  }
  function pickShort(p: { shortName: { en: string; el: string } }) {
    return p.shortName[lang] ?? p.shortName.en;
  }

  // Bilingual share parsing for input boxes (Greek uses "," as decimal point).
  function parseShare(raw: string): number {
    if (!raw) return 0;
    const normalised = raw.replace(',', '.');
    const n = parseFloat(normalised);
    return Number.isFinite(n) ? n : 0;
  }
</script>

<div class="panel" lang={lang}>
  <header class="panel-head">
    <div>
      <h3 class="panel-title">{txt.title}</h3>
      <p class="panel-sub">{txt.approxNote}</p>
    </div>
    <div class="total-pill" class:over={simulatorState.totalSharePct > 100.05}
         class:under={simulatorState.totalSharePct < 99.95}>
      <span class="total-pill-label">{txt.totalShare}</span>
      <span class="total-pill-value">{fmtPct(simulatorState.totalSharePct)}%</span>
    </div>
  </header>

  <!-- ---- Presets ---- -->
  <div class="presets" role="group" aria-label={txt.presets}>
    <button
      type="button"
      class="btn btn-primary"
      onclick={() => simulatorState.apply2021Actual()}
    >{txt.apply2021}</button>

    <label class="poll-picker">
      <span class="poll-picker-label">{txt.pollLabel}</span>
      <select bind:value={selectedPollIndex}>
        <option value={-1}>-</option>
        {#each finalPolls as poll (poll.index)}
          <option value={poll.index}>{poll.label}</option>
        {/each}
      </select>
    </label>
    <button
      type="button"
      class="btn"
      disabled={selectedPollIndex < 0}
      onclick={onApplyPoll}
    >{txt.pollApply}</button>

    <button
      type="button"
      class="btn btn-quiet"
      onclick={() => simulatorState.reset()}
    >{txt.reset}</button>
  </div>

  {#if simulatorState.activePresetLabel}
    <p class="active-preset">
      <span class="muted">{txt.activePreset}:</span>
      {simulatorState.activePresetLabel[lang] ??
        simulatorState.activePresetLabel.en}
    </p>
  {/if}

  <!-- ---- Filter toggle ---- -->
  <label class="filter-toggle">
    <input type="checkbox" bind:checked={showAll} />
    <span>{showAll ? txt.showAll : txt.activeOnly}</span>
  </label>

  <!-- ---- Party rows ---- -->
  <ul class="party-list" role="list">
    {#each visibleParties as party (party.id)}
      {@const value = simulatorState.shares[party.id] ?? 0}
      <li class="party-row">
        <span
          class="swatch"
          style:background-color={partyColour(party.id)}
          aria-hidden="true"
        ></span>
        <span class="party-name" title={pickName(party)}>
          {pickShort(party)}
        </span>
        <input
          type="range"
          min="0"
          max="40"
          step="0.1"
          value={value}
          oninput={(e) =>
            simulatorState.setShare(
              party.id as PartyId,
              parseShare((e.currentTarget as HTMLInputElement).value)
            )}
          aria-label={`${pickShort(party)} ${lang === 'el' ? 'ποσοστό' : 'share'}`}
        />
        <input
          class="num"
          type="text"
          inputmode="decimal"
          value={value === 0 ? '' : fmtPct(value)}
          oninput={(e) =>
            simulatorState.setShare(
              party.id as PartyId,
              parseShare((e.currentTarget as HTMLInputElement).value)
            )}
          aria-label={`${pickShort(party)} ${lang === 'el' ? 'ποσοστό' : 'share'}`}
        />
        <span class="suffix">%</span>
      </li>
    {/each}
  </ul>

  <!-- ---- Turnout ---- -->
  <div class="turnout">
    <div class="turnout-head">
      <span>{txt.turnoutLabel}</span>
      <strong class="turnout-value">
        {fmtPct(simulatorState.turnout * 100)}%
      </strong>
    </div>
    <input
      type="range"
      min="40"
      max="80"
      step="0.1"
      value={simulatorState.turnout * 100}
      oninput={(e) =>
        simulatorState.setTurnout(
          parseShare((e.currentTarget as HTMLInputElement).value) / 100
        )}
      aria-label={txt.turnoutLabel}
    />
    <p class="muted small">{txt.turnoutNote}</p>
  </div>

  <!-- ---- Total share warning ---- -->
  {#if simulatorState.totalSharePct > 100.05}
    <p class="warn">{txt.warnOver}</p>
  {:else if simulatorState.totalSharePct < 99.95 && simulatorState.totalSharePct > 0}
    <p class="muted small">{txt.warnUnder}</p>
  {/if}
</div>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
    padding: var(--sp-5);
    background: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
  }

  .panel-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--sp-4);
    flex-wrap: wrap;
  }
  .panel-title {
    font-family: var(--font-display);
    font-variation-settings: var(--fvs-display-md);
    font-size: var(--fs-300);
    line-height: var(--lh-snug);
    letter-spacing: var(--tracking-snug);
    margin: 0;
    color: var(--color-ink);
  }
  .panel-sub {
    margin: var(--sp-1) 0 0;
    font-size: var(--fs-75);
    color: var(--color-ink-3);
    max-width: 48ch;
  }

  .total-pill {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    padding: var(--sp-2) var(--sp-4);
    border-radius: var(--radius-3);
    background: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    min-width: 9ch;
  }
  .total-pill.over {
    background: var(--color-warn-soft);
    border-color: color-mix(in oklab, var(--color-warn) 30%, transparent);
  }
  .total-pill.under {
    background: var(--color-info-soft);
    border-color: color-mix(in oklab, var(--color-info) 18%, transparent);
  }
  .total-pill-label {
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
  }
  .total-pill-value {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: var(--color-ink);
  }

  .presets {
    display: flex;
    gap: var(--sp-3);
    align-items: center;
    flex-wrap: wrap;
  }
  .btn {
    appearance: none;
    border: 1px solid var(--color-rule-strong);
    background: var(--color-paper);
    color: var(--color-ink);
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    font-weight: 500;
    padding: var(--sp-2) var(--sp-4);
    border-radius: var(--radius-3);
    cursor: pointer;
    transition: background var(--dur-fast), border-color var(--dur-fast);
  }
  .btn:hover { background: var(--color-paper-3); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .btn-primary {
    background: var(--color-accent);
    color: var(--color-accent-ink);
    border-color: var(--color-accent);
  }
  .btn-primary:hover { background: var(--color-accent-hover); }
  .btn-quiet {
    border-color: var(--color-rule);
    color: var(--color-ink-3);
  }

  .poll-picker {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    font-size: var(--fs-75);
    color: var(--color-ink-3);
  }
  .poll-picker select {
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    padding: 6px var(--sp-3);
    border: 1px solid var(--color-rule-strong);
    border-radius: var(--radius-3);
    background: var(--color-paper);
    color: var(--color-ink);
    max-width: 22ch;
  }
  .poll-picker-label {
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
  }

  .active-preset {
    margin: 0;
    font-size: var(--fs-75);
    color: var(--color-ink-2);
  }
  .active-preset .muted {
    color: var(--color-ink-3);
    margin-right: var(--sp-2);
  }

  .filter-toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    font-size: var(--fs-75);
    color: var(--color-ink-3);
    user-select: none;
    cursor: pointer;
  }

  .party-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--sp-2);
  }
  .party-row {
    display: grid;
    grid-template-columns: 14px minmax(8ch, 16ch) 1fr 6ch 1ch;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-2) var(--sp-3);
    border-radius: var(--radius-2);
    background: var(--color-paper);
    transition: background var(--dur-fast);
  }
  .party-row:hover { background: var(--color-paper-2); }
  .swatch {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }
  .party-name {
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    color: var(--color-ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .num {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-size: var(--fs-75);
    text-align: right;
    width: 100%;
    padding: 4px 6px;
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-2);
    background: var(--color-paper);
    color: var(--color-ink);
  }
  .num:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .suffix {
    font-size: var(--fs-75);
    color: var(--color-ink-3);
  }
  input[type='range'] {
    width: 100%;
    accent-color: var(--color-accent);
  }
  input[type='range']:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
    border-radius: var(--radius-pill);
  }

  .turnout {
    border-top: 1px solid var(--color-rule);
    padding-top: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }
  .turnout-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: var(--fs-75);
    color: var(--color-ink-2);
  }
  .turnout-value {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    color: var(--color-ink);
  }

  .warn {
    margin: 0;
    padding: var(--sp-2) var(--sp-3);
    background: var(--color-warn-soft);
    border-left: 3px solid var(--color-warn);
    font-size: var(--fs-75);
    color: var(--color-ink-2);
    border-radius: var(--radius-2);
  }

  .muted { color: var(--color-ink-3); }
  .small { font-size: var(--fs-75); margin: 0; }

  /* ---- Mobile: tighter layout, keep the slider inline ---- */
  @media (max-width: 480px) {
    .party-row {
      /* swatch · name (shrinks, truncates) · slider · number · suffix */
      grid-template-columns: 12px minmax(0, 5.5ch) minmax(48px, 1fr) 4.5ch 1ch;
      column-gap: var(--sp-2);
      padding: var(--sp-2);
    }
    .party-name {
      font-size: var(--fs-50);
    }
    .num {
      padding: 3px 4px;
      font-size: var(--fs-50);
    }
    .suffix {
      font-size: var(--fs-50);
    }
  }
</style>
