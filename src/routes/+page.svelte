<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  type Lang = 'en' | 'el';

  let lang: Lang = $state('en');

  onMount(() => {
    // Soft auto-detect once, after hydration. Respects prerendered HTML on first paint.
    const nav = typeof navigator !== 'undefined' ? navigator.language : '';
    if (nav && nav.toLowerCase().startsWith('el')) lang = 'el';
  });

  type Copy = {
    folioDate: string;
    folioMeta: string;
    titleA: string;
    titleB: string;
    titleC: string;
    lede: string;
    cta: string;
    altLink: string;
    altLinkLang: Lang;
    meta: string;
    aria: string;
  };

  const copy: Record<Lang, Copy> = {
    en: {
      folioDate: '24 · 05 · 2026',
      folioMeta: '56 seats / 6 districts',
      titleA: 'Cyprus',
      titleB: 'Parliamentary',
      titleC: 'Elections',
      lede:
        'How parliament is really chosen — and why a national poll tells you almost nothing about who actually wins seats.',
      cta: 'Continue in English',
      altLink: 'Διαβάστε στα Ελληνικά',
      altLinkLang: 'el',
      meta:
        'An independent, non-partisan explainer & seat simulator. Built from public research and official sources.',
      aria: 'Continue to the English version of the site'
    },
    el: {
      folioDate: '24 · 05 · 2026',
      folioMeta: '56 έδρες / 6 επαρχίες',
      titleA: 'Βουλευτικές',
      titleB: 'Εκλογές',
      titleC: 'Κύπρου',
      lede:
        'Πώς εκλέγεται πραγματικά η Βουλή — και γιατί μια εθνική δημοσκόπηση σχεδόν τίποτα δεν σου λέει για τις έδρες που πραγματικά κρίνονται.',
      cta: 'Συνέχεια στα Ελληνικά',
      altLink: 'Read in English',
      altLinkLang: 'en',
      meta:
        'Ανεξάρτητος, μη-κομματικός οδηγός και προσομοιωτής εδρών. Βασισμένος σε δημόσιες πηγές και επίσημα στοιχεία.',
      aria: 'Συνέχεια στην ελληνική έκδοση'
    }
  };

  let c = $derived(copy[lang]);
</script>

<svelte:head>
  <title>Cyprus 2026 — Choose language / Επιλογή γλώσσας</title>
  <meta
    name="description"
    content="Cyprus parliamentary elections 2026: an independent, interactive explainer in English & Greek."
  />
</svelte:head>

<main class="landing" lang={lang} data-lang={lang}>
  <span class="watermark" aria-hidden="true">2026</span>

  <header class="topbar">
    <span class="brand">
      <span class="brand__mark">CY</span>
      <span class="brand__slash" aria-hidden="true">/</span>
      <span class="brand__year">'26</span>
    </span>

    <nav class="toggle" aria-label="Choose interface language">
      <button
        type="button"
        class="toggle__opt"
        class:toggle__opt--active={lang === 'en'}
        aria-pressed={lang === 'en'}
        onclick={() => (lang = 'en')}
      >
        EN
      </button>
      <span class="toggle__sep" aria-hidden="true">/</span>
      <button
        type="button"
        class="toggle__opt"
        class:toggle__opt--active={lang === 'el'}
        aria-pressed={lang === 'el'}
        onclick={() => (lang = 'el')}
        lang="el"
      >
        ΕΛ
      </button>
    </nav>
  </header>

  {#key lang}
    <section class="hero" aria-live="polite">
      <p class="folio">
        <span class="folio__date">{c.folioDate}</span>
        <span class="folio__dot" aria-hidden="true">·</span>
        <span class="folio__meta">{c.folioMeta}</span>
      </p>

      <h1 class="title">
        <span class="title__line title__line--solid title__line--a">{c.titleA}</span>
        <span class="title__line title__line--italic title__line--b">{c.titleB}</span>
        <span class="title__line title__line--solid title__line--c">{c.titleC}</span>
      </h1>

      <p class="lede">{c.lede}</p>

      <span class="rule" aria-hidden="true"></span>

      <a
        class="cta"
        href={`${base}/${lang}`}
        data-sveltekit-reload
        aria-label={c.aria}
      >
        <span class="cta__label">{c.cta}</span>
        <span class="cta__arrow" aria-hidden="true">
          <svg viewBox="0 0 64 14" width="64" height="14" fill="none" stroke="currentColor" stroke-width="1.4">
            <path d="M0 7h60M53 1l7 6-7 6" stroke-linecap="square" stroke-linejoin="miter" />
          </svg>
        </span>
      </a>
    </section>
  {/key}

  <footer class="bottombar">
    <p class="meta">{c.meta}</p>
    <p class="alt">
      <button
        type="button"
        class="alt__link"
        onclick={() => (lang = c.altLinkLang)}
        lang={c.altLinkLang}
      >
        {c.altLink}
        <span aria-hidden="true">→</span>
      </button>
    </p>
  </footer>
</main>

<style>
  .landing {
    position: relative;
    min-height: 100dvh;
    background: var(--color-paper);
    color: var(--color-ink);
    overflow: hidden;
    display: grid;
    grid-template-rows: auto 1fr auto;
    isolation: isolate;
  }

  /* ----------------------------------------------------------------------
     Decorative giant year numeral. Sits behind the hero, bleeds off-canvas. */
  .watermark {
    position: absolute;
    right: clamp(-8vw, -4vw, 2rem);
    bottom: clamp(-22vh, -14vh, -4rem);
    z-index: 0;
    pointer-events: none;
    user-select: none;
    font-family: var(--font-display);
    font-style: italic;
    font-variation-settings: 'opsz' 144, 'SOFT' 100, 'wght' 700;
    font-size: clamp(20rem, 50vw, 60rem);
    line-height: 0.76;
    letter-spacing: -0.07em;
    color: var(--color-paper-3);
  }
  /* Slightly stronger tint when Greek is active - gives a subtle "swap" cue. */
  .landing[data-lang='el'] .watermark {
    color: var(--color-accent-soft);
  }

  /* ----------------------------------------------------------------------
     Topbar */
  .topbar {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: clamp(1rem, 1.8vw, 1.75rem) clamp(1.25rem, 3vw, 3rem);
    border-bottom: 1px solid var(--color-rule);
  }

  .brand {
    display: inline-flex;
    align-items: baseline;
    gap: 0.25rem;
    font-family: var(--font-display);
    color: var(--color-ink);
    line-height: 1;
  }
  .brand__mark {
    font-variation-settings: 'opsz' 36, 'SOFT' 0, 'wght' 700;
    font-size: 1.125rem;
    letter-spacing: -0.01em;
  }
  .brand__slash {
    color: var(--color-rule-strong);
    font-weight: 300;
    font-size: 1.125rem;
    font-style: italic;
  }
  .brand__year {
    font-variation-settings: 'opsz' 36, 'SOFT' 80, 'wght' 500;
    font-style: italic;
    font-size: 1.05rem;
    color: var(--color-accent);
  }

  .toggle {
    display: inline-flex;
    align-items: baseline;
    gap: 0.45rem;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    letter-spacing: var(--tracking-eyebrow);
  }
  .toggle__opt {
    appearance: none;
    background: none;
    border: 0;
    margin: 0;
    padding: 0.35rem 0.15rem;
    font: inherit;
    letter-spacing: inherit;
    color: var(--color-ink-3);
    cursor: pointer;
    text-transform: uppercase;
    position: relative;
    transition: color var(--dur-fast) var(--ease-standard);
  }
  .toggle__opt:hover {
    color: var(--color-ink);
  }
  .toggle__opt:focus-visible {
    outline: none;
    color: var(--color-ink);
  }
  .toggle__opt:focus-visible::before {
    content: '';
    position: absolute;
    inset: -0.25rem -0.4rem;
    border: 1px solid var(--color-focus);
  }
  .toggle__opt--active {
    color: var(--color-ink);
  }
  .toggle__opt--active::after {
    content: '';
    position: absolute;
    left: 0.1rem;
    right: 0.1rem;
    bottom: 0.1rem;
    height: 1px;
    background: var(--color-accent);
  }
  .toggle__sep {
    color: var(--color-ink-4);
    font-weight: 300;
  }

  /* ----------------------------------------------------------------------
     Hero - the typographic centerpiece. */
  .hero {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: clamp(2.5rem, 7vw, 6.5rem) clamp(1.5rem, 7vw, 7rem)
      clamp(2rem, 5vw, 4rem);
    display: grid;
    align-content: center;
    justify-items: start;
  }
  .hero {
    animation: hero-rise 420ms var(--ease-standard) both;
  }
  @keyframes hero-rise {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .folio {
    margin: 0 0 clamp(2rem, 3.5vw, 3rem);
    padding: 0 1rem 0.75rem 0;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    border-bottom: 1px solid var(--color-rule);
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-ink-3);
  }
  .folio__date {
    color: var(--color-ink-2);
    font-variant-numeric: tabular-nums;
  }
  .folio__dot {
    color: var(--color-ink-4);
    font-size: 1.05em;
  }

  .title {
    margin: 0 0 clamp(1.25rem, 2.5vw, 2rem);
    font-family: var(--font-display);
    font-size: clamp(2.875rem, 9vw, 7.5rem);
    line-height: 0.93;
    letter-spacing: -0.025em;
    color: var(--color-ink);
    display: flex;
    flex-direction: column;
    max-width: 14ch;
  }
  /* Greek glyphs are wider; allow more room. */
  .landing[data-lang='el'] .title {
    max-width: 17ch;
    font-size: clamp(2.5rem, 7.8vw, 6.5rem);
  }
  .title__line {
    display: inline-block;
    opacity: 0;
    animation: line-in 620ms var(--ease-standard) forwards;
  }
  .title__line--a { animation-delay: 80ms; }
  .title__line--b { animation-delay: 180ms; }
  .title__line--c { animation-delay: 280ms; }
  @keyframes line-in {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .title__line--solid {
    font-variation-settings: 'opsz' 144, 'SOFT' 40, 'wght' 600;
    font-style: normal;
  }
  .title__line--italic {
    font-variation-settings: 'opsz' 96, 'SOFT' 100, 'wght' 380;
    font-style: italic;
    color: var(--color-accent);
    margin-left: 0.06em;
    /* Optical adjustment: italics ride a bit higher in the line. */
    transform: translateY(0.02em);
  }

  .lede {
    margin: 0 0 clamp(1.5rem, 2.5vw, 2.25rem);
    max-width: 52ch;
    font-family: var(--font-display);
    font-variation-settings: 'opsz' 36, 'SOFT' 60, 'wght' 400;
    font-size: clamp(1.0625rem, 1.4vw, 1.35rem);
    line-height: 1.45;
    letter-spacing: -0.003em;
    color: var(--color-ink-2);
    opacity: 0;
    animation: line-in 620ms var(--ease-standard) 380ms forwards;
  }

  .rule {
    display: block;
    width: 3.5rem;
    height: 1px;
    background: var(--color-accent);
    margin: 0 0 clamp(1.25rem, 2vw, 1.75rem);
    transform-origin: left;
    transform: scaleX(0);
    animation: rule-grow 480ms var(--ease-standard) 460ms forwards;
  }
  @keyframes rule-grow {
    to { transform: scaleX(1); }
  }

  /* CTA - editorial pull-link, not a button-y blob. */
  .cta {
    display: inline-flex;
    align-items: center;
    gap: 1.1rem;
    padding: 0.85rem 0;
    font-family: var(--font-sans);
    font-size: clamp(1.0625rem, 1.3vw, 1.25rem);
    font-weight: 500;
    color: var(--color-ink);
    text-decoration: none;
    letter-spacing: -0.003em;
    border-bottom: 1px solid transparent;
    transition: color var(--dur-base) var(--ease-standard),
      border-color var(--dur-base) var(--ease-standard);
    opacity: 0;
    animation: line-in 620ms var(--ease-standard) 540ms forwards;
  }
  .cta:hover,
  .cta:focus-visible {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
    outline: none;
  }
  .cta__arrow {
    display: inline-flex;
    color: var(--color-accent);
    transition: transform var(--dur-base) var(--ease-emphatic);
  }
  .cta:hover .cta__arrow,
  .cta:focus-visible .cta__arrow {
    transform: translateX(8px);
  }

  /* ----------------------------------------------------------------------
     Bottombar */
  .bottombar {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: clamp(0.875rem, 1.4vw, 1.25rem) clamp(1.25rem, 3vw, 3rem);
    border-top: 1px solid var(--color-rule);
    background: linear-gradient(
      to bottom,
      transparent 0,
      var(--color-paper) 60%
    );
  }
  .meta {
    margin: 0;
    max-width: 56ch;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--color-ink-3);
  }
  .alt {
    margin: 0;
    flex-shrink: 0;
  }
  .alt__link {
    appearance: none;
    background: none;
    border: 0;
    padding: 0;
    margin: 0;
    font: inherit;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    color: var(--color-ink-2);
    cursor: pointer;
    display: inline-flex;
    align-items: baseline;
    gap: 0.35rem;
    border-bottom: 1px solid var(--color-rule);
    padding-bottom: 2px;
    transition: color var(--dur-fast) var(--ease-standard),
      border-color var(--dur-fast) var(--ease-standard);
  }
  .alt__link:hover,
  .alt__link:focus-visible {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
    outline: none;
  }
  .alt__link span {
    color: var(--color-accent);
    transition: transform var(--dur-base) var(--ease-emphatic);
  }
  .alt__link:hover span,
  .alt__link:focus-visible span {
    transform: translateX(4px);
  }

  /* ----------------------------------------------------------------------
     Responsive */
  @media (max-width: 720px) {
    .topbar {
      padding-inline: 1.25rem;
    }
    .hero {
      padding: clamp(2rem, 6vw, 3.5rem) 1.25rem clamp(1.5rem, 4vw, 2.5rem);
    }
    .bottombar {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      padding-inline: 1.25rem;
    }
    .watermark {
      right: -10vw;
      bottom: -8vh;
      font-size: 28rem;
    }
    .title {
      max-width: 11ch;
    }
    .landing[data-lang='el'] .title {
      max-width: 13ch;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero,
    .title__line,
    .lede,
    .rule,
    .cta {
      animation: none;
      opacity: 1;
      transform: none;
    }
    .rule { transform: scaleX(1); }
  }
</style>
