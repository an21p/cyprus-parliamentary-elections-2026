<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Lang } from '$i18n/dict';
  import Nav from './Nav.svelte';
  import Footer from './Footer.svelte';

  type Props = {
    lang: Lang;
    currentPath: string;
    title: string;
    eyebrow?: string;
    lede?: string;
    /** Per-page editorial numeral that bleeds off the hero's right edge. */
    numeral?: string;
    children?: Snippet;
  };

  let { lang, currentPath, title, eyebrow, lede, numeral, children }: Props = $props();

  const skipLabel = $derived(lang === 'el' ? 'Μετάβαση στο περιεχόμενο' : 'Skip to content');
</script>

<a class="skip-link" href="#main-content">{skipLabel}</a>

<div class="shell">
  <Nav {lang} {currentPath} />

  <main id="main-content" class="main" tabindex="-1">
    <header class="hero">
      {#if numeral}
        <span class="hero-numeral" aria-hidden="true">{numeral}</span>
      {/if}
      <div class="hero-inner">
        {#if eyebrow}
          <p class="hero-eyebrow">{eyebrow}</p>
        {/if}
        <h1 class="hero-title">{title}</h1>
        {#if lede}
          <p class="hero-lede">{lede}</p>
        {/if}
      </div>
    </header>

    <div class="content">
      <div class="content-inner">
        {#if children}{@render children()}{/if}
      </div>
    </div>
  </main>

  <Footer {lang} />
</div>

<style>
  .shell {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  .main {
    flex: 1 0 auto;
    outline: none;
  }

  /* ---------- Hero ---------- */
  .hero {
    position: relative;
    overflow: hidden;
    border-top: 1px solid var(--color-accent);   /* full-width olive hairline */
    border-bottom: 1px solid var(--color-rule);
    background-color: var(--color-paper);
  }

  /* Editorial numeral bleeding off the right edge of the hero.
     Massive Fraunces digit at low opacity - each page gets its own number. */
  .hero-numeral {
    position: absolute;
    top: -0.18em;
    right: -0.10em;
    font-family: var(--font-display);
    font-variation-settings: "opsz" 144, "SOFT" 100, "wght" 700;
    /* Min keeps a readable size on phones without crowding the H1; max caps
       it on very wide displays where it would otherwise dominate. */
    font-size: clamp(6rem, 22vw, 22rem);
    line-height: 1;
    letter-spacing: -0.05em;
    color: var(--color-accent);
    opacity: 0.10;
    pointer-events: none;
    user-select: none;
    z-index: 0;
    font-variant-numeric: lining-nums tabular-nums;
  }

  /* On very narrow viewports, dial the numeral down further so it sits as
     a quiet ornament rather than competing with the hero title for room. */
  @media (max-width: 480px) {
    .hero-numeral {
      font-size: clamp(4.5rem, 26vw, 7rem);
      opacity: 0.08;
    }
  }

  .hero-inner {
    position: relative;
    z-index: 1;
    max-width: var(--max-content);
    margin-inline: auto;
    padding: var(--sp-7) var(--gutter-sm) var(--sp-8);
  }

  @media (min-width: 768px) {
    .hero-inner {
      padding: var(--sp-8) var(--gutter-md) var(--sp-9);
    }
  }

  @media (min-width: 1024px) {
    .hero-inner {
      padding: var(--sp-9) var(--gutter-lg);
    }
  }

  .hero-eyebrow {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-accent);
    margin-bottom: var(--sp-4);
    max-width: none;
  }

  .hero-title {
    font-family: var(--font-display);
    font-variation-settings: var(--fvs-display-xl);
    font-weight: 600;
    font-size: var(--fs-600);
    line-height: var(--lh-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-ink);
    text-wrap: balance;
    max-width: 22ch;
  }

  .hero-lede {
    margin-top: var(--sp-5);
    font-family: var(--font-display);
    font-variation-settings: var(--fvs-display-sm);
    font-weight: 400;
    font-size: var(--fs-300);
    line-height: var(--lh-snug);
    color: var(--color-ink-2);
    max-width: 56ch;
    text-wrap: pretty;
  }

  :global(:lang(el)) .hero-lede {
    /* Noto Serif Greek body text can look heavy; switch lede to Noto Sans
       in Greek to match the body type system. */
    font-family: var(--font-greek);
  }

  /* ---------- Content ---------- */
  .content {
    background-color: var(--color-paper);
  }

  .content-inner {
    max-width: var(--max-content);
    margin-inline: auto;
    padding: var(--sp-7) var(--gutter-sm) var(--sp-8);
  }

  @media (min-width: 768px) {
    .content-inner {
      padding: var(--sp-8) var(--gutter-md);
    }
  }

  @media (min-width: 1024px) {
    .content-inner {
      padding: var(--sp-8) var(--gutter-lg) var(--sp-9);
    }
  }

  /* Skip link copies the global utility so PageShell is self-contained when
     mounted in isolation (e.g. tests / Storybook). */
  .skip-link {
    position: absolute;
    left: var(--sp-4);
    top: var(--sp-4);
    background: var(--color-ink);
    color: var(--color-paper);
    padding: var(--sp-2) var(--sp-4);
    border-radius: var(--radius-3);
    font-size: var(--fs-75);
    font-weight: 600;
    z-index: var(--z-toast);
    text-decoration: none;
    transform: translateY(-150%);
    transition: transform var(--dur-fast) var(--ease-standard);
  }

  .skip-link:focus-visible {
    transform: translateY(0);
    outline: none;
    box-shadow: var(--focus-ring);
  }
</style>
