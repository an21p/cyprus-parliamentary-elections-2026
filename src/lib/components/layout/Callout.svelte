<script lang="ts">
  import type { Snippet } from 'svelte';

  type Tone = 'info' | 'warn' | 'fact';

  type Props = {
    tone: Tone;
    title?: string;
    label?: string;
    children?: Snippet;
  };

  let { tone, title, label, children }: Props = $props();

  // Visual badge text - kept short, locale-agnostic glyph + word.
  const defaultLabels: Record<Tone, string> = {
    info: 'Note',
    warn: 'Watch',
    fact: 'Fact'
  };

  const displayLabel = $derived(label ?? defaultLabels[tone]);
</script>

<aside class="callout callout--{tone}" role={tone === 'warn' ? 'note' : 'note'}>
  <div class="callout-rail" aria-hidden="true"></div>
  <div class="callout-body">
    <p class="callout-label">
      <span class="callout-label-text">{displayLabel}</span>
    </p>
    {#if title}
      <p class="callout-title">{title}</p>
    {/if}
    {#if children}
      <div class="callout-content">
        {@render children()}
      </div>
    {/if}
  </div>
</aside>

<style>
  .callout {
    display: grid;
    grid-template-columns: 3px 1fr;
    gap: 0;
    background-color: var(--callout-bg);
    border: 1px solid var(--callout-border);
    border-radius: var(--radius-3);
    padding: 0;
    margin-block: var(--sp-5);
    overflow: hidden;
    max-width: var(--max-prose);
  }

  .callout-rail {
    background-color: var(--callout-accent);
  }

  .callout-body {
    padding: var(--sp-4) var(--sp-5);
    min-width: 0;
  }

  .callout-label {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    margin: 0 0 var(--sp-2);
    max-width: none;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    font-weight: 600;
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--callout-accent);
  }

  .callout-label::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: var(--radius-pill);
    background-color: var(--callout-accent);
    flex-shrink: 0;
  }

  .callout-title {
    font-family: var(--font-display);
    font-size: var(--fs-300);
    line-height: var(--lh-snug);
    color: var(--color-ink);
    margin: 0 0 var(--sp-2);
    font-weight: 600;
    max-width: none;
    text-wrap: balance;
  }

  .callout-content {
    font-size: var(--fs-100);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
  }

  .callout-content :global(p) {
    margin: 0;
    max-width: none;
  }

  .callout-content :global(p + p) {
    margin-top: var(--sp-3);
  }

  .callout-content :global(strong) {
    color: var(--color-ink);
    font-weight: 600;
  }

  /* ---------- Tone variants ---------- */
  .callout--info {
    --callout-bg: var(--color-info-soft);
    --callout-border: color-mix(in oklab, var(--color-info) 18%, transparent);
    --callout-accent: var(--color-info);
  }

  .callout--warn {
    --callout-bg: var(--color-warn-soft);
    --callout-border: color-mix(in oklab, var(--color-warn) 22%, transparent);
    --callout-accent: var(--color-warn);
  }

  .callout--fact {
    --callout-bg: var(--color-fact-soft);
    --callout-border: color-mix(in oklab, var(--color-fact) 22%, transparent);
    --callout-accent: var(--color-fact);
  }
</style>
