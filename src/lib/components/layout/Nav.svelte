<script lang="ts">
  import { base } from '$app/paths';
  import type { Lang } from '$i18n/dict';
  import { t } from '$i18n/dict';
  import LangSwitcher from './LangSwitcher.svelte';
  import { a11yPrefs, toggleColourblind } from '$lib/theme/a11y.svelte';

  type Props = {
    lang: Lang;
    currentPath: string;
  };

  let { lang, currentPath }: Props = $props();

  let mobileOpen = $state(false);

  type NavKey =
    | 'nav.home'
    | 'nav.system'
    | 'nav.districts'
    | 'nav.parties'
    | 'nav.polls'
    | 'nav.simulator'
    | 'nav.worked_example'
    | 'nav.worked_example.nicosia'
    | 'nav.worked_example.govcy'
    | 'nav.about';

  type NavChild = { key: NavKey; slug: string };
  type NavItem = { key: NavKey; slug: string; children?: NavChild[] };

  const items: NavItem[] = [
    { key: 'nav.home',           slug: '' },
    { key: 'nav.system',         slug: 'system' },
    { key: 'nav.districts',      slug: 'districts' },
    { key: 'nav.parties',        slug: 'parties' },
    { key: 'nav.polls',          slug: 'polls' },
    { key: 'nav.simulator',      slug: 'simulator' },
    {
      key: 'nav.worked_example',
      slug: 'worked-example',
      children: [
        { key: 'nav.worked_example.nicosia', slug: 'worked-example' },
        { key: 'nav.worked_example.govcy',   slug: 'worked-example/gov-cy' }
      ]
    },
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

  function isExactlyActive(slug: string): boolean {
    const path = currentPath || '/';
    const target = slug ? `${base}/${lang}/${slug}` : `${base}/${lang}`;
    return path === target || path === `${target}/`;
  }

  // Track which dropdown is open. Null = none. Closed on outside click / Esc.
  let openDropdownKey: NavKey | null = $state(null);
  function toggleDropdown(key: NavKey) {
    openDropdownKey = openDropdownKey === key ? null : key;
  }
  function closeDropdowns() {
    openDropdownKey = null;
  }

  function closeMobile() {
    mobileOpen = false;
    closeDropdowns();
  }
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.key === 'Escape') {
      if (openDropdownKey) closeDropdowns();
      else if (mobileOpen) closeMobile();
    }
  }}
  on:click={(e) => {
    if (!openDropdownKey) return;
    const t = e.target as HTMLElement | null;
    if (!t || !t.closest('.nav-item--dropdown')) closeDropdowns();
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
          {#if item.children}
            {@const open = openDropdownKey === item.key}
            <li class="nav-item--dropdown">
              <button
                type="button"
                class="nav-link nav-link--dropdown"
                class:active
                aria-expanded={open}
                aria-haspopup="menu"
                onclick={() => toggleDropdown(item.key)}
              >
                {t(lang, item.key)}
                <svg class="nav-caret" class:open width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
                  <path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              {#if open}
                <ul class="nav-dropdown" role="menu" aria-label={t(lang, item.key)}>
                  {#each item.children as child (child.key)}
                    {@const childActive = isExactlyActive(child.slug)}
                    <li role="none">
                      <a
                        href={hrefFor(child.slug)}
                        class="nav-dropdown-link"
                        class:active={childActive}
                        role="menuitem"
                        aria-current={childActive ? 'page' : undefined}
                        onclick={closeDropdowns}
                      >
                        {t(lang, child.key)}
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>
          {:else}
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
          {/if}
        {/each}
      </ul>
    </nav>

    <div class="nav-trailing">
      <button
        type="button"
        class="a11y-btn"
        class:a11y-btn--on={a11yPrefs.colourblind}
        aria-pressed={a11yPrefs.colourblind}
        aria-label={t(lang, 'a11y.colourblind.aria_toggle')}
        title={t(lang, 'a11y.colourblind.label')}
        onclick={toggleColourblind}
      >
        <svg
          class="a11y-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <!-- Half-filled circle: standard "high contrast / colour adjust" mark. -->
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.75" />
          <path d="M12 3 a9 9 0 0 1 0 18 z" fill="currentColor" />
        </svg>
        <span class="visually-hidden">{t(lang, 'a11y.colourblind.label')}</span>
      </button>
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
            {#if item.children}
              <div class="drawer-group-label">{t(lang, item.key)}</div>
              <ul class="drawer-children" role="list">
                {#each item.children as child (child.key)}
                  {@const childActive = isExactlyActive(child.slug)}
                  <li>
                    <a
                      href={hrefFor(child.slug)}
                      class="drawer-link drawer-link--child"
                      class:active={childActive}
                      aria-current={childActive ? 'page' : undefined}
                      onclick={closeMobile}
                    >
                      {t(lang, child.key)}
                    </a>
                  </li>
                {/each}
              </ul>
            {:else}
              <a
                href={hrefFor(item.slug)}
                class="drawer-link"
                class:active
                aria-current={active ? 'page' : undefined}
                onclick={closeMobile}
              >
                {t(lang, item.key)}
              </a>
            {/if}
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

  /* ---------- Dropdown (desktop) ---------- */
  .nav-item--dropdown {
    position: relative;
  }

  .nav-link--dropdown {
    border: 0;
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: inherit;
  }

  .nav-caret {
    color: currentColor;
    transition: transform var(--dur-fast) var(--ease-standard);
  }

  .nav-caret.open {
    transform: rotate(180deg);
  }

  .nav-dropdown {
    list-style: none;
    margin: 0;
    padding: var(--sp-2);
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 14rem;
    background-color: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    z-index: 1;
  }

  .nav-dropdown-link {
    display: block;
    padding: var(--sp-2) var(--sp-3);
    font-family: var(--font-sans);
    font-size: var(--fs-100);
    font-weight: 500;
    color: var(--color-ink-2);
    text-decoration: none;
    border-radius: var(--radius-2);
    transition: background-color var(--dur-fast) var(--ease-standard),
                color var(--dur-fast) var(--ease-standard);
  }

  .nav-dropdown-link:hover {
    background-color: var(--color-paper-2);
    color: var(--color-ink);
  }

  .nav-dropdown-link:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .nav-dropdown-link.active {
    color: var(--color-ink);
    background-color: var(--color-accent-soft);
  }

  /* ---------- Trailing ---------- */
  .nav-trailing {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    justify-self: end;
  }

  /* ---------- A11y palette toggle ---------- */
  .a11y-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    background-color: transparent;
    color: var(--color-ink-2);
    cursor: pointer;
    transition: background-color var(--dur-fast) var(--ease-standard),
                border-color var(--dur-fast) var(--ease-standard),
                color var(--dur-fast) var(--ease-standard);
  }

  .a11y-btn:hover {
    background-color: var(--color-paper-2);
    border-color: var(--color-rule-strong);
    color: var(--color-ink);
  }

  .a11y-btn:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .a11y-btn--on {
    background-color: var(--color-accent-soft);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .a11y-btn--on:hover {
    background-color: var(--color-accent-soft);
    color: var(--color-accent-hover);
  }

  .a11y-icon {
    display: block;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
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

  .drawer-group-label {
    padding: var(--sp-3) var(--sp-3) var(--sp-1);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    font-weight: 700;
    color: var(--color-ink-2);
  }

  .drawer-children {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 2px;
  }

  .drawer-link--child {
    padding-left: var(--sp-5);
    font-size: var(--fs-100);
  }
</style>
