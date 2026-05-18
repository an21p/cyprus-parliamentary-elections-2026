<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    step: number;
    title: string;
    /** Eyebrow above the title (e.g. localised "Step 1 of 4"). Optional. */
    eyebrow?: string;
    body: Snippet;
    figure?: Snippet;
  };

  let { step, title, eyebrow, body, figure }: Props = $props();

  let el: HTMLElement | undefined = $state();
  let visible = $state(false);

  $effect(() => {
    if (!el || typeof IntersectionObserver === 'undefined') {
      visible = true;
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visible = true;
            obs.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<section
  bind:this={el}
  class="step"
  class:step--visible={visible}
  aria-labelledby={`worked-step-${step}-title`}
>
  <div class="step-text">
    <p class="step-eyebrow">
      {#if eyebrow}{eyebrow}{:else}Step {step}{/if}
    </p>
    <h3 id={`worked-step-${step}-title`} class="step-title">{title}</h3>
    <div class="step-body">
      {@render body()}
    </div>
  </div>

  {#if figure}
    <aside class="step-figure" role="figure">
      {@render figure()}
    </aside>
  {/if}
</section>

<style>
  .step {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-5);
    padding-block: var(--sp-7);
    border-top: 1px solid var(--color-rule);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 480ms var(--ease-standard), transform 480ms var(--ease-standard);
  }

  .step:first-of-type {
    border-top: 0;
    padding-top: var(--sp-5);
  }

  .step--visible {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .step {
      transition: none;
      opacity: 1;
      transform: none;
    }
  }

  @media (min-width: 880px) {
    .step {
      grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
      align-items: start;
      gap: var(--sp-7);
    }
  }

  .step-eyebrow {
    margin: 0 0 var(--sp-2);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    font-weight: 700;
    color: var(--color-accent);
  }

  .step-title {
    margin: 0 0 var(--sp-4);
    font-family: var(--font-display);
    font-size: var(--fs-400);
    font-weight: 600;
    line-height: var(--lh-tight);
    letter-spacing: var(--tracking-snug);
    color: var(--color-ink);
    text-wrap: balance;
  }

  .step-body {
    font-family: var(--font-sans);
    font-size: var(--fs-200);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
    max-width: var(--max-prose);
  }

  .step-body :global(p) {
    margin: 0;
    max-width: none;
  }

  .step-body :global(p + p) {
    margin-top: var(--sp-4);
  }

  .step-body :global(strong) {
    color: var(--color-ink);
    font-weight: 600;
  }

  .step-body :global(em) {
    font-style: italic;
    color: var(--color-ink);
  }

  .step-figure {
    min-width: 0;
  }
</style>
