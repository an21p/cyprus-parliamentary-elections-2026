<script lang="ts">
  import { base } from '$app/paths';
  import type { Lang } from '$i18n/dict';
  import { t } from '$i18n/dict';
  import LangSwitcher from './LangSwitcher.svelte';

  type Props = {
    lang: Lang;
    currentPath: string;
  };

  let { lang, currentPath }: Props = $props();

  let mobileOpen = $state(false);

  type NavKey =
    | 'nav.home'
    | 'nav.system'
    | 'nav.simulator'
    | 'nav.polls'
    | 'nav.districts'
    | 'nav.parties'
    | 'nav.worked_example'
    | 'nav.about';

  type NavItem = { key: NavKey; slug: string };

  const items: NavItem[] = [
    { key: 'nav.home',           slug: '' },
    { key: 'nav.system',         slug: 'system' },
    { key: 'nav.simulator',      slug: 'simulator' },
    { key: 'nav.polls',          slug: 'polls' },
    { key: 'nav.districts',      slug: 'districts' },
    { key: 'nav.parties',        slug: 'parties' },
    { key: 'nav.worked_example', slug: 'worked-example' },
    { key: 'nav.about',          slug: 'about' }
  ];

  function hrefFor(slug: string): string {
    return slug ? `${base}/${lang}/${slug}` : `${base}/${lang}`;
  }

  function isActive(slug: string): boolean {
    const path = currentPath || '/';
    const root = `${base}/${lang}`;
    if (slug === '') {
      return path === root || path === `${root}/`;
    }
    const target = `${root}/${slug}`;
    return path === target || path.startsWith(`${target}/`);
  }

  function closeMobile() {
    mobileOpen = false;
  }
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.key === 'Escape' && mobileOpen) closeMobile();
  }}
/>

<header class="nav-root" class:is-open={mobileOpen}>
  <div class="nav-inner">
    <a class="wordmark" href={hrefFor('')} onclick={closeMobile} aria-label={t(lang, 'site.title')}>
      <img class="wordmark-mark" src="{base}/favicon.svg" alt="" width="32" height="32" />
      <span class="wordmark-label">
        <span class="wordmark-title">{t(lang, 'site.title')}</span>
      </span>
    </a>

    <nav class="nav-primary" aria-label={lang === 'el' ? 'Κύρια πλοήγηση' : 'Primary navigation'}>
      <ul class="nav-list" role="list">
        {#each items as item (item.key)}
          {@const active = isActive(item.slug)}
          <li>
            <a
              href={hrefFor(item.slug)}
              class="nav-link"
              class:active
              aria-current={active ? 'page' : undefined}
            >
              {t(lang, item.key)}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="nav-trailing">
      <LangSwitcher {lang} {currentPath} />
      <button
        type="button"
        class="nav-toggle"
        aria-expanded={mobileOpen}
        aria-controls="nav-drawer"
        aria-label={mobileOpen
          ? (lang === 'el' ? 'Κλείσιμο μενού' : 'Close menu')
          : (lang === 'el' ? 'Άνοιγμα μενού' : 'Open menu')}
        onclick={() => (mobileOpen = !mobileOpen)}
      >
        <span class="nav-toggle-bars" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
  </div>

  <!-- Mobile drawer -->
  <div
    id="nav-drawer"
    class="nav-drawer"
    role="dialog"
    aria-modal="true"
    aria-label={lang === 'el' ? 'Πλοήγηση' : 'Navigation'}
    hidden={!mobileOpen}
  >
    <nav aria-label={lang === 'el' ? 'Κύρια πλοήγηση (κινητό)' : 'Primary navigation (mobile)'}>
      <ul class="drawer-list" role="list">
        {#each items as item (item.key)}
          {@const active = isActive(item.slug)}
          <li>
            <a
              href={hrefFor(item.slug)}
              class="drawer-link"
              class:active
              aria-current={active ? 'page' : undefined}
              onclick={closeMobile}
            >
              {t(lang, item.key)}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</header>

<style>
  .nav-root {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    background-color: color-mix(in oklab, var(--color-paper) 86%, transparent);
    backdrop-filter: saturate(140%) blur(10px);
    -webkit-backdrop-filter: saturate(140%) blur(10px);
    border-bottom: 1px solid var(--color-rule);
  }

  .nav-inner {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--sp-5);
    max-width: var(--max-bleed);
    margin-inline: auto;
    padding: 0 var(--gutter-sm);
    height: var(--header-h);
  }

  @media (min-width: 768px) {
    .nav-inner {
      padding: 0 var(--gutter-md);
      height: var(--header-h-md);
    }
  }

  @media (min-width: 1024px) {
    .nav-inner {
      padding: 0 var(--gutter-lg);
    }
  }

  /* ---------- Wordmark ---------- */
  .wordmark {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-3);
    text-decoration: none;
    color: var(--color-ink);
    min-width: 0;
  }

  .wordmark:focus-visible {
    outline: none;
    border-radius: var(--radius-2);
    box-shadow: var(--focus-ring);
  }

  .wordmark-mark {
    display: block;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  .wordmark-title {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: var(--tracking-snug);
    color: var(--color-ink);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 18ch;
    /* On phones, hide the wordmark title - the CY lozenge is enough mark
       and the title is still announced via the wordmark's aria-label. */
    display: none;
  }

  @media (min-width: 768px) {
    .wordmark-title {
      display: inline;
      max-width: 32ch;
      font-size: 1rem;
    }
  }

  /* ---------- Primary nav (desktop) ---------- */
  .nav-primary {
    display: none;
    min-width: 0;
    justify-self: center;
  }

  @media (min-width: 1024px) {
    .nav-primary {
      display: block;
    }
  }

  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: var(--sp-1);
  }

  .nav-link {
    position: relative;
    display: inline-block;
    padding: var(--sp-2) var(--sp-3);
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    font-weight: 500;
    color: var(--color-ink-2);
    text-decoration: none;
    border-radius: var(--radius-2);
    transition: color var(--dur-fast) var(--ease-standard),
                background-color var(--dur-fast) var(--ease-standard);
  }

  .nav-link:hover {
    color: var(--color-ink);
    background-color: var(--color-paper-2);
  }

  .nav-link:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .nav-link.active {
    color: var(--color-ink);
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    left: var(--sp-3);
    right: var(--sp-3);
    bottom: -2px;
    height: 2px;
    background-color: var(--color-accent);
  }

  /* ---------- Trailing ---------- */
  .nav-trailing {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    justify-self: end;
  }

  .nav-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    background-color: transparent;
    color: var(--color-ink);
    transition: background-color var(--dur-fast) var(--ease-standard),
                border-color var(--dur-fast) var(--ease-standard);
  }

  .nav-toggle:hover {
    background-color: var(--color-paper-2);
    border-color: var(--color-rule-strong);
  }

  .nav-toggle:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  @media (min-width: 1024px) {
    .nav-toggle {
      display: none;
    }
  }

  .nav-toggle-bars {
    display: inline-flex;
    flex-direction: column;
    gap: 4px;
    width: 16px;
  }

  .nav-toggle-bars span {
    display: block;
    height: 1.5px;
    background-color: currentColor;
    transition: transform var(--dur-fast) var(--ease-standard),
                opacity var(--dur-fast) var(--ease-standard);
    transform-origin: center;
  }

  .nav-root.is-open .nav-toggle-bars span:nth-child(1) {
    transform: translateY(5.5px) rotate(45deg);
  }

  .nav-root.is-open .nav-toggle-bars span:nth-child(2) {
    opacity: 0;
  }

  .nav-root.is-open .nav-toggle-bars span:nth-child(3) {
    transform: translateY(-5.5px) rotate(-45deg);
  }

  /* ---------- Mobile drawer ---------- */
  .nav-drawer {
    display: block;
    border-top: 1px solid var(--color-rule);
    background-color: var(--color-paper);
    padding: var(--sp-4) var(--gutter-sm) var(--sp-5);
    max-height: calc(100dvh - var(--header-h));
    overflow-y: auto;
  }

  @media (min-width: 768px) {
    .nav-drawer {
      padding: var(--sp-5) var(--gutter-md);
    }
  }

  .nav-drawer[hidden] {
    display: none;
  }

  @media (min-width: 1024px) {
    .nav-drawer,
    .nav-drawer[hidden] {
      display: none;
    }
  }

  .drawer-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 2px;
  }

  .drawer-link {
    display: block;
    padding: var(--sp-3) var(--sp-3);
    font-family: var(--font-sans);
    font-size: var(--fs-200);
    font-weight: 500;
    color: var(--color-ink-2);
    text-decoration: none;
    border-radius: var(--radius-3);
    border-left: 2px solid transparent;
    transition: background-color var(--dur-fast) var(--ease-standard),
                color var(--dur-fast) var(--ease-standard),
                border-color var(--dur-fast) var(--ease-standard);
  }

  .drawer-link:hover {
    background-color: var(--color-paper-2);
    color: var(--color-ink);
  }

  .drawer-link:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .drawer-link.active {
    color: var(--color-ink);
    border-left-color: var(--color-accent);
    background-color: var(--color-accent-soft);
  }
</style>
