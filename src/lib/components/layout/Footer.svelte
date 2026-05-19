<script lang="ts">
  import { base } from '$app/paths';
  import type { Lang } from '$i18n/dict';
  import { t } from '$i18n/dict';

  type Props = {
    lang: Lang;
  };

  let { lang }: Props = $props();

  type NavKey =
    | 'nav.home'
    | 'nav.system'
    | 'nav.districts'
    | 'nav.parties'
    | 'nav.polls'
    | 'nav.simulator'
    | 'nav.worked_example'
    | 'nav.about';

  type NavItem = { key: NavKey; slug: string };

  const sections: NavItem[] = [
    { key: 'nav.home',           slug: '' },
    { key: 'nav.system',         slug: 'system' },
    { key: 'nav.districts',      slug: 'districts' },
    { key: 'nav.parties',        slug: 'parties' },
    { key: 'nav.polls',          slug: 'polls' },
    { key: 'nav.simulator',      slug: 'simulator' },
    { key: 'nav.worked_example', slug: 'worked-example' },
    { key: 'nav.about',          slug: 'about' }
  ];

  function hrefFor(slug: string): string {
    return slug ? `${base}/${lang}/${slug}` : `${base}/${lang}`;
  }

  const year = new Date().getFullYear();

  const sectionsLabel = $derived(lang === 'el' ? 'Ενότητες' : 'Sections');
  const referenceLabel = $derived(lang === 'el' ? 'Αναφορά' : 'Reference');
  const builtLabel = $derived(
    lang === 'el'
      ? 'Δημιουργήθηκε για τις εκλογές της 24ης Μαΐου 2026.'
      : 'Built for the 24 May 2026 vote.'
  );
  const footerHeadingLabel = $derived(lang === 'el' ? 'Υποσέλιδο' : 'Footer');
  const identityLabel = $derived(lang === 'el' ? 'Ταυτότητα' : 'Identity');
</script>

<footer class="footer-root" aria-labelledby="footer-heading">
  <h2 id="footer-heading" class="sr-only">{footerHeadingLabel}</h2>

  <div class="footer-inner">
    <!-- Column 1: identity + disclaimer -->
    <section class="footer-col footer-identity" aria-label={identityLabel}>
      <a href={hrefFor('')} class="footer-wordmark">
        <img class="footer-mark" src="{base}/favicon.svg" alt="" width="32" height="32" />
        <span class="footer-title">{t(lang, 'site.title')}</span>
      </a>
      <p class="footer-disclaimer">{t(lang, 'footer.disclaimer')}</p>
      <p class="footer-meta">
        <span class="footer-meta-line">{builtLabel}</span>
        <span class="footer-meta-sep" aria-hidden="true">·</span>
        <span class="footer-meta-line">&copy; {year}</span>
      </p>
    </section>

    <!-- Column 2: section links -->
    <nav class="footer-col" aria-label={sectionsLabel}>
      <h3 class="footer-heading">{sectionsLabel}</h3>
      <ul class="footer-list" role="list">
        {#each sections as item (item.key)}
          <li>
            <a href={hrefFor(item.slug)} class="footer-link">{t(lang, item.key)}</a>
          </li>
        {/each}
      </ul>
    </nav>

    <!-- Column 3: sources + methodology -->
    <nav class="footer-col" aria-label={referenceLabel}>
      <h3 class="footer-heading">{referenceLabel}</h3>
      <ul class="footer-list" role="list">
        <li>
          <a href={`${hrefFor('about')}#sources`} class="footer-link">{t(lang, 'footer.sources')}</a>
        </li>
        <li>
          <a href={hrefFor('about')} class="footer-link">{t(lang, 'nav.about')}</a>
        </li>
      </ul>
    </nav>
  </div>
</footer>

<style>
  .footer-root {
    margin-top: var(--sp-9);
    background-color: var(--color-paper-2);
    border-top: 1px solid var(--color-rule);
    color: var(--color-ink-3);
  }

  .footer-inner {
    max-width: var(--max-bleed);
    margin-inline: auto;
    padding: var(--sp-7) var(--gutter-sm);
    display: grid;
    gap: var(--sp-6);
    grid-template-columns: 1fr;
  }

  @media (min-width: 640px) {
    .footer-inner {
      padding: var(--sp-7) var(--gutter-md);
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 1024px) {
    .footer-inner {
      padding: var(--sp-8) var(--gutter-lg);
      grid-template-columns: 2fr 1fr 1fr;
      gap: var(--sp-7);
    }
  }

  .footer-col {
    min-width: 0;
  }

  .footer-identity {
    max-width: 44ch;
  }

  /* ---------- Wordmark ---------- */
  .footer-wordmark {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-3);
    text-decoration: none;
    color: var(--color-ink);
    margin-bottom: var(--sp-4);
  }

  .footer-wordmark:focus-visible {
    outline: none;
    border-radius: var(--radius-2);
    box-shadow: var(--focus-ring);
  }

  .footer-mark {
    display: block;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  .footer-title {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 600;
    line-height: var(--lh-snug);
    color: var(--color-ink);
  }

  .footer-disclaimer {
    font-size: var(--fs-75);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-3);
    margin-bottom: var(--sp-4);
    max-width: 44ch;
  }

  .footer-meta {
    font-size: var(--fs-50);
    color: var(--color-ink-4);
    letter-spacing: var(--tracking-wide);
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
    max-width: none;
  }

  .footer-meta-sep {
    color: var(--color-rule-strong);
  }

  /* ---------- Column heading + lists ---------- */
  .footer-heading {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    margin-bottom: var(--sp-4);
  }

  .footer-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--sp-2);
  }

  .footer-link {
    display: inline-block;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    color: var(--color-ink-2);
    text-decoration: none;
    padding: 2px 0;
    border-bottom: 1px solid transparent;
    transition: color var(--dur-fast) var(--ease-standard),
                border-color var(--dur-fast) var(--ease-standard);
  }

  .footer-link:hover {
    color: var(--color-ink);
    border-bottom-color: var(--color-rule-strong);
  }

  .footer-link:focus-visible {
    outline: none;
    border-radius: var(--radius-2);
    box-shadow: var(--focus-ring);
  }

  .sr-only {
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
</style>
