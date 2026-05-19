<script lang="ts">
  import type { DistrictId, Lang } from '$data/types';
  import { getDistrict } from '$data/districts';
  import { localizedName } from '$i18n/dict';

  type Props = {
    districtId: DistrictId;
    lang: Lang;
  };

  let { districtId, lang }: Props = $props();

  const district = $derived(getDistrict(districtId));

  const L = $derived({
    eyebrow: lang === 'el' ? 'Ψηφοδέλτιο' : 'Ballot',
    district: lang === 'el' ? 'Επαρχία' : 'District',
    crossHint:
      lang === 'el'
        ? (n: number) =>
            n === 1
              ? 'Μπορείτε να σημειώσετε έως 1 σταυρό προτίμησης.'
              : `Μπορείτε να σημειώσετε έως ${n} σταυρούς προτίμησης.`
        : (n: number) =>
            n === 1
              ? 'You may mark up to 1 preference cross.'
              : `You may mark up to ${n} preference crosses.`,
    listHeader: lang === 'el' ? 'Λίστα κόμματος' : 'Party list',
    candidate: lang === 'el' ? 'Υποψήφιος/α' : 'Candidate',
    mark: lang === 'el' ? 'Σταυρός' : 'Cross',
    note:
      lang === 'el'
        ? 'Σχηματική αναπαράσταση· δεν είναι το επίσημο ψηφοδέλτιο.'
        : 'Illustrative; not the official ballot artwork.',
    instructions: lang === 'el' ? 'Οδηγίες' : 'Instructions',
    colourLabel: lang === 'el' ? 'Χρώμα' : 'Colour'
  });

  // 3 placeholder candidate rows (purely visual mock)
  const sampleRows = [1, 2, 3];
</script>

<article
  class="ballot"
  style="--ballot-color: {district.ballotColour};"
  aria-label={`${L.eyebrow}: ${localizedName(district, lang)}`}
>
  <header class="ballot-stripe">
    <p class="ballot-stripe-text">
      {L.eyebrow} · {localizedName(district.ballotColourLabel, lang)}
    </p>
  </header>

  <div class="ballot-body">
    <p class="ballot-eyebrow">{L.district}</p>
    <h3 class="ballot-name">{localizedName(district, lang)}</h3>

    <p class="ballot-hint">
      <strong>{L.instructions}.</strong> {L.crossHint(district.preferenceCrosses)}
    </p>

    <div class="list-block" aria-hidden="true">
      <p class="list-header">{L.listHeader}</p>
      <ul class="list-rows" role="list">
        {#each sampleRows as i (i)}
          <li>
            <span class="row-name">{L.candidate} {i}</span>
            <span class="row-box" aria-label={L.mark}></span>
          </li>
        {/each}
      </ul>
    </div>

    <p class="ballot-foot">
      <span class="meta">
        <span
          class="meta-swatch"
          style="background-color: {district.ballotColour};"
          aria-hidden="true"
        ></span>
        {L.colourLabel}: {localizedName(district.ballotColourLabel, lang)}
      </span>
      <span class="meta">
        {district.preferenceCrosses}
        {lang === 'el' ? 'σταυροί' : 'crosses'}
      </span>
    </p>

    <p class="ballot-note">{L.note}</p>
  </div>
</article>

<style>
  .ballot {
    max-width: 380px;
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    overflow: hidden;
    box-shadow: var(--shadow-2);
    display: flex;
    flex-direction: column;
  }

  .ballot-stripe {
    background-color: var(--ballot-color);
    padding: var(--sp-3) var(--sp-4);
    border-bottom: 2px solid var(--color-ink);
    /* Pick legible text colour on top of bright ballot colours */
    color: var(--color-ink);
  }

  .ballot-stripe-text {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    font-weight: 700;
    color: inherit;
    /* Slightly translucent dark text for accessibility on light stripes;
       dark stripes inherit body --color-ink which gives high contrast. */
    text-shadow: 0 0 0 currentColor;
  }

  .ballot-body {
    padding: var(--sp-5);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .ballot-eyebrow {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    font-weight: 600;
  }

  .ballot-name {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--fs-400);
    font-weight: 600;
    color: var(--color-ink);
    line-height: var(--lh-tight);
  }

  .ballot-hint {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    line-height: var(--lh-snug);
    color: var(--color-ink-2);
    padding: var(--sp-3);
    background-color: var(--color-accent-soft);
    border-left: 3px solid var(--color-accent);
    border-radius: var(--radius-2);
  }

  .list-block {
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-2);
    padding: var(--sp-3);
    background-color: var(--color-paper-2);
  }

  .list-header {
    margin: 0 0 var(--sp-2);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    font-weight: 600;
  }

  .list-rows {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  .list-rows li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-3);
    padding: var(--sp-2) 0;
    border-bottom: 1px dashed var(--color-rule);
  }

  .list-rows li:last-child {
    border-bottom: 0;
  }

  .row-name {
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    color: var(--color-ink-3);
  }

  .row-box {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 1.5px solid var(--color-ink);
    border-radius: var(--radius-1);
    background-color: var(--color-paper);
  }

  .ballot-foot {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--sp-3);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    color: var(--color-ink-3);
  }

  .meta {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
  }

  .meta-swatch {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: var(--radius-1);
    border: 1px solid rgba(20, 24, 31, 0.2);
  }

  .ballot-note {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 11px;
    color: var(--color-ink-4);
    font-style: italic;
  }
</style>
