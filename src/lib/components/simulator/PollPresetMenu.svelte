<script lang="ts">
  import type { Lang } from '$i18n/dict';
  import { POLLS } from '$data/polls';
  import { simulatorState } from '$lib/simulator/state.svelte';

  type Props = { lang: Lang };
  let { lang }: Props = $props();

  let selected = $state<number>(-1);

  // Most recent first (POLLS is already in roughly recent-first order).
  const options = $derived(
    POLLS.map((p, i) => ({
      index: i,
      label:
        lang === 'el'
          ? `${formatDateRange(p.fieldworkStart, p.fieldworkEnd, 'el')} · ${p.pollster}`
          : `${formatDateRange(p.fieldworkStart, p.fieldworkEnd, 'en')} · ${p.pollster}`
    }))
  );

  function formatDateRange(startISO: string, endISO: string, l: Lang): string {
    const locale = l === 'el' ? 'el-CY' : 'en-CY';
    const start = new Date(startISO);
    const end = new Date(endISO);
    const fmt = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short'
    });
    return `${fmt.format(start)}–${fmt.format(end)}`;
  }

  function onApply(): void {
    if (selected >= 0) simulatorState.applyPoll(selected);
  }

  const txt = $derived({
    label:
      lang === 'el' ? 'Φόρτωση από δημοσκόπηση' : 'Load from a poll',
    apply: lang === 'el' ? 'Εφαρμογή' : 'Apply',
    none: '—'
  });
</script>

<div class="row">
  <label class="lbl">
    <span class="lbl-text">{txt.label}</span>
    <select bind:value={selected} aria-label={txt.label}>
      <option value={-1}>{txt.none}</option>
      {#each options as opt (opt.index)}
        <option value={opt.index}>{opt.label}</option>
      {/each}
    </select>
  </label>
  <button class="btn" disabled={selected < 0} onclick={onApply}>
    {txt.apply}
  </button>
</div>

<style>
  .row {
    display: flex;
    gap: var(--sp-3);
    align-items: flex-end;
    flex-wrap: wrap;
  }
  .lbl {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: var(--font-sans);
    flex: 1 1 18ch;
  }
  .lbl-text {
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
  }
  select {
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    padding: 6px var(--sp-3);
    border: 1px solid var(--color-rule-strong);
    border-radius: var(--radius-3);
    background: var(--color-paper);
    color: var(--color-ink);
  }
  .btn {
    appearance: none;
    border: 1px solid var(--color-rule-strong);
    background: var(--color-paper);
    color: var(--color-ink);
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    font-weight: 500;
    padding: 6px var(--sp-4);
    border-radius: var(--radius-3);
    cursor: pointer;
  }
  .btn:hover { background: var(--color-paper-3); }
  .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
