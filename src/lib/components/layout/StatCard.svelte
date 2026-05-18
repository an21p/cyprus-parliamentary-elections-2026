<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    /** Big headline number, pre-formatted as a string (e.g. "56", "3.6%", "568,587"). */
    value: string;
    /** Optional small label above the number — typically an eyebrow / category. */
    eyebrow?: string;
    /** Short caption beneath the value. */
    caption?: string;
    /** Optional suffix appended after the value (e.g. "seats"). Rendered smaller. */
    unit?: string;
    /** Optional trend / change indicator string (e.g. "+1 vs 2021"). */
    delta?: string;
    /** Optional explicit delta tone — colours the delta string. */
    deltaTone?: 'neutral' | 'positive' | 'warn' | 'fact';
    /** Optional rich children appended after caption. */
    children?: Snippet;
  };

  let {
    value,
    eyebrow,
    caption,
    unit,
    delta,
    deltaTone = 'neutral',
    children
  }: Props = $props();
</script>

<article class="stat-card">
  {#if eyebrow}
    <p class="stat-eyebrow">{eyebrow}</p>
  {/if}

  <p class="stat-value-row">
    <span class="stat-value">{value}</span>
    {#if unit}
      <span class="stat-unit">{unit}</span>
    {/if}
  </p>

  {#if caption}
    <p class="stat-caption">{caption}</p>
  {/if}

  {#if delta}
    <p class="stat-delta stat-delta--{deltaTone}">{delta}</p>
  {/if}

  {#if children}
    <div class="stat-extra">
      {@render children()}
    </div>
  {/if}
</article>

<style>
  .stat-card {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    padding: var(--sp-5) var(--sp-5);
    background-color: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    position: relative;
    overflow: hidden;
    transition: border-color var(--dur-fast) var(--ease-standard),
                background-color var(--dur-fast) var(--ease-standard);
  }

  /* Top hairline accent — single restrained editorial mark. */
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: var(--sp-7);
    height: 2px;
    background-color: var(--color-accent);
  }

  .stat-card:hover {
    border-color: var(--color-rule-strong);
  }

  .stat-eyebrow {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    margin: 0;
    max-width: none;
  }

  .stat-value-row {
    display: flex;
    align-items: baseline;
    gap: var(--sp-2);
    margin: 0;
    max-width: none;
  }

  .stat-value {
    font-family: var(--font-display);
    font-feature-settings: 'tnum' 1, 'lnum' 1, 'ss01' 1;
    font-variant-numeric: tabular-nums lining-nums;
    font-weight: 600;
    font-size: var(--fs-700);
    line-height: 1;
    letter-spacing: var(--tracking-tight);
    color: var(--color-ink);
  }

  .stat-unit {
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: var(--fs-100);
    color: var(--color-ink-3);
    letter-spacing: var(--tracking-snug);
  }

  .stat-caption {
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    line-height: var(--lh-snug);
    color: var(--color-ink-3);
    margin: 0;
    max-width: none;
  }

  .stat-delta {
    font-family: var(--font-mono);
    font-size: var(--fs-50);
    font-variant-numeric: tabular-nums;
    margin: 0;
    max-width: none;
    letter-spacing: 0.02em;
  }

  .stat-delta--neutral  { color: var(--color-ink-3); }
  .stat-delta--positive { color: var(--color-positive); }
  .stat-delta--warn     { color: var(--color-warn); }
  .stat-delta--fact     { color: var(--color-fact); }

  .stat-extra {
    margin-top: var(--sp-2);
    font-size: var(--fs-75);
    color: var(--color-ink-3);
  }
</style>
