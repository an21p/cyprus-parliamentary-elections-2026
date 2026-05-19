<script lang="ts">
  import type { Lang } from '$data/types';

  export type LegendItem = {
    id: string;
    label: string;
    colour: string;
  };

  type Props = {
    items: LegendItem[];
    lang: Lang;
    /** Optional title rendered above the swatches. */
    title?: string;
    /** When set, controls which item ids are currently active.
     *  If undefined, every item is shown as active. */
    active?: string[];
    /** Optional callback when a swatch is toggled. If omitted swatches are
     *  rendered as static badges (no interaction). */
    onToggle?: (id: string) => void;
  };

  let { items, lang, title, active, onToggle }: Props = $props();

  const isActive = (id: string): boolean =>
    active === undefined ? true : active.includes(id);

  const interactive = $derived(typeof onToggle === 'function');
</script>

<div class="legend" aria-label={title ?? (lang === 'el' ? 'Υπόμνημα' : 'Legend')}>
  {#if title}
    <p class="legend-title">{title}</p>
  {/if}
  <ul class="legend-list" role="list">
    {#each items as item (item.id)}
      {@const on = isActive(item.id)}
      <li>
        {#if interactive}
          <button
            type="button"
            class="chip"
            class:chip--off={!on}
            aria-pressed={on}
            onclick={() => onToggle?.(item.id)}
          >
            <span class="chip-swatch" style="background-color: {item.colour};" aria-hidden="true"
            ></span>
            <span class="chip-label">{item.label}</span>
          </button>
        {:else}
          <span class="chip chip--static" class:chip--off={!on}>
            <span class="chip-swatch" style="background-color: {item.colour};" aria-hidden="true"
            ></span>
            <span class="chip-label">{item.label}</span>
          </span>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .legend {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    width: 100%;
  }

  .legend-title {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    margin: 0;
  }

  .legend-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--sp-2);
  }

  .legend-list > li {
    display: flex;
    align-items: center;
  }

  .chip {
    /* Fix the chip box dimensions so the chip-swatch and label can't
       shift baseline between chips (otherwise the first row can sit
       a pixel high or low depending on font metrics). */
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    height: 24px;
    padding: 0 var(--sp-3);
    border-radius: var(--radius-pill);
    background-color: var(--color-paper-2);
    border: 1px solid var(--color-rule);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    line-height: 1;
    color: var(--color-ink);
    cursor: default;
    box-sizing: border-box;
  }

  button.chip {
    cursor: pointer;
    transition: background-color var(--dur-fast) var(--ease-standard),
      border-color var(--dur-fast) var(--ease-standard);
  }

  button.chip:hover {
    border-color: var(--color-rule-strong);
  }

  button.chip:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .chip--off {
    opacity: 0.4;
  }

  .chip-swatch {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: var(--radius-1);
    flex-shrink: 0;
    border: 1px solid rgba(20, 24, 31, 0.18);
  }

  .chip-label {
    font-weight: 500;
    white-space: nowrap;
  }
</style>
