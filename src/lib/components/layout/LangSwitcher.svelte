<script lang="ts">
  import { base } from '$app/paths';
  import type { Lang } from '$i18n/dict';
  import { t, otherLang } from '$i18n/dict';

  type Props = {
    lang: Lang;
    currentPath: string;
  };

  let { lang, currentPath }: Props = $props();

  const target = $derived(otherLang(lang));

  /**
   * Swap the leading /en or /el segment of the current path for the other
   * language. The path is expected to begin with /en/... or /el/... (with or
   * without a trailing slash). If the prefix can't be found we fall back to
   * the root of the other language so the link is still useful.
   */
  const href = $derived.by(() => {
    const path = currentPath || '/';
    // currentPath comes from url.pathname which includes the deployment base.
    // Strip it before matching so the regex works regardless of where we're hosted.
    const stripped = base && path.startsWith(base) ? path.slice(base.length) || '/' : path;
    const match = stripped.match(/^\/(en|el)(\/.*)?$/);
    if (!match) return `${base}/${target}`;
    const rest = match[2] ?? '';
    return `${base}/${target}${rest}`;
  });

  const label = $derived(
    target === 'en' ? t(lang, 'lang.switch_to_en') : t(lang, 'lang.switch_to_el')
  );

  // Aria-label in the CURRENT reading language, with the target language's
  // native name as an exonym. Screen readers TTS the verb in the page lang.
  const ariaLabel = $derived(
    lang === 'en'
      ? (target === 'el' ? 'Switch language to Ελληνικά' : 'Switch language to English')
      : (target === 'en' ? 'Αλλαγή γλώσσας στα English'   : 'Αλλαγή γλώσσας στα Ελληνικά')
  );
</script>

<a
  class="lang-switcher"
  {href}
  hreflang={target}
  lang={target}
  aria-label={ariaLabel}
  data-sveltekit-reload
>
  <span class="current" aria-hidden="true">{lang.toUpperCase()}</span>
  <span class="sep" aria-hidden="true">/</span>
  <span class="target">{label}</span>
</a>

<style>
  .lang-switcher {
    display: inline-flex;
    align-items: baseline;
    gap: 0.35em;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    font-weight: 500;
    letter-spacing: var(--tracking-wide);
    color: var(--color-ink-2);
    text-decoration: none;
    padding: var(--sp-1) var(--sp-3);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-pill);
    background: transparent;
    transition: background-color var(--dur-fast) var(--ease-standard),
                border-color var(--dur-fast) var(--ease-standard),
                color var(--dur-fast) var(--ease-standard);
    white-space: nowrap;
  }

  .lang-switcher:hover {
    background-color: var(--color-paper-2);
    border-color: var(--color-rule-strong);
    color: var(--color-ink);
  }

  .lang-switcher:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .current {
    font-variant-numeric: tabular-nums;
    color: var(--color-ink-4);
    letter-spacing: 0.08em;
  }

  .sep {
    color: var(--color-ink-4);
  }

  .target {
    color: inherit;
  }
</style>
