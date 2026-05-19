<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    id?: string;
    eyebrow?: string;
    title: string;
    lede?: string;
    children?: Snippet;
  };

  let { id, eyebrow, title, lede, children }: Props = $props();

  const headingId = $derived(id ? `${id}-title` : undefined);
</script>

<section {id} class="section" aria-labelledby={headingId}>
  <header class="section-header">
    {#if eyebrow}
      <p class="section-eyebrow">{eyebrow}</p>
    {/if}
    <h2 id={headingId} class="section-title">{title}</h2>
    {#if lede}
      <p class="section-lede">{lede}</p>
    {/if}
  </header>

  {#if children}
    <div class="section-body">
      {@render children()}
    </div>
  {/if}
</section>

<style>
  .section {
    padding-block: var(--sp-7);
    border-top: 1px solid var(--color-rule);
  }

  .section:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  @media (min-width: 768px) {
    .section {
      padding-block: var(--sp-8);
    }
  }

  /* Anchor offset for sticky nav. */
  .section[id] {
    scroll-margin-top: calc(var(--header-h-md) + var(--sp-4));
  }

  /* ---------- Header ---------- */
  .section-header {
    margin-bottom: var(--sp-6);
    max-width: var(--max-prose);
  }

  .section-eyebrow {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-accent);
    margin-bottom: var(--sp-3);
    max-width: none;
  }

  .section-title {
    font-family: var(--font-display);
    font-variation-settings: var(--fvs-display-lg);
    font-size: var(--fs-500);
    font-weight: 600;
    line-height: var(--lh-tight);
    letter-spacing: var(--tracking-snug);
    color: var(--color-ink);
    text-wrap: balance;
  }

  .section-lede {
    margin-top: var(--sp-4);
    font-size: var(--fs-200);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
    max-width: 56ch;
  }

  /* ---------- Body ----------
     Inherits prose width by default; children can opt out by setting their
     own max-width when they need a wider canvas (charts, grids). */
  .section-body :global(> * + *) {
    margin-top: var(--sp-5);
  }

  .section-body :global(> h3) {
    margin-top: var(--sp-7);
  }
</style>
