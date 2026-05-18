<script lang="ts">
  import { t } from '$i18n/dict';
</script>

<svelte:head>
  <title>Cyprus 2026 — Choose language / Επιλογή γλώσσας</title>
  <meta name="description" content="Cyprus parliamentary elections 2026 — interactive explainer in English & Greek." />
</svelte:head>

<main class="picker">
  <div class="picker__inner">
    <p class="picker__eyebrow">24 May 2026</p>
    <h1 class="picker__title">
      <span>{t('en', 'site.title')}</span>
      <span class="picker__sep" aria-hidden="true">·</span>
      <span lang="el">{t('el', 'site.title')}</span>
    </h1>
    <p class="picker__lede">{t('en', 'site.tagline')}</p>
    <p class="picker__lede" lang="el">{t('el', 'site.tagline')}</p>

    <div class="picker__choices">
      <a class="picker__choice" href="/en" data-sveltekit-reload>
        <span class="picker__choice-label">English</span>
        <span class="picker__choice-arrow" aria-hidden="true">→</span>
      </a>
      <a class="picker__choice" href="/el" data-sveltekit-reload lang="el">
        <span class="picker__choice-label">Ελληνικά</span>
        <span class="picker__choice-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</main>

<style>
  .picker {
    min-height: 100dvh;
    display: grid;
    place-items: center;
    padding: var(--space-8) var(--space-6);
    background-color: var(--color-paper);
  }
  .picker__inner {
    max-width: 56ch;
    text-align: left;
  }
  .picker__eyebrow {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-ink-muted);
    margin: 0 0 var(--space-4);
  }
  .picker__title {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    line-height: 1.05;
    margin: 0 0 var(--space-6);
    color: var(--color-ink);
    font-weight: 600;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  .picker__sep { display: none; }
  .picker__lede {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    line-height: 1.4;
    color: var(--color-ink-muted);
    margin: 0 0 var(--space-3);
  }
  .picker__choices {
    margin-top: var(--space-8);
    display: grid;
    gap: var(--space-3);
  }
  .picker__choice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-5) var(--space-6);
    border: 1px solid var(--color-rule);
    background: var(--color-surface, #fff);
    color: var(--color-ink);
    text-decoration: none;
    font-family: var(--font-sans);
    font-size: var(--text-md);
    transition: border-color 200ms var(--ease), transform 200ms var(--ease);
  }
  .picker__choice:hover,
  .picker__choice:focus-visible {
    border-color: var(--color-accent);
    transform: translateY(-1px);
    outline: none;
  }
  .picker__choice-arrow {
    color: var(--color-accent);
  }
  @media (min-width: 640px) {
    .picker__choices {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
