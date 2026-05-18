<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    /**
     * Minimum width of each card in the auto-fit grid. Drop down to 200 if
     * you want a denser grid of small stats; raise to 280 for a sparser one.
     */
    minColumnWidth?: number;
    /** Optional rule above the grid. */
    bordered?: boolean;
    children?: Snippet;
  };

  let { minColumnWidth = 240, bordered = false, children }: Props = $props();

  const gridStyle = $derived(
    `--stat-grid-min: ${minColumnWidth}px;`
  );
</script>

<div class="stat-grid" class:bordered style={gridStyle} role="list">
  {#if children}{@render children()}{/if}
</div>

<style>
  .stat-grid {
    display: grid;
    gap: var(--sp-4);
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(100%, var(--stat-grid-min, 240px)), 1fr)
    );
  }

  .stat-grid.bordered {
    padding-top: var(--sp-5);
    border-top: 1px solid var(--color-rule);
  }

  @media (min-width: 768px) {
    .stat-grid {
      gap: var(--sp-5);
    }
  }
</style>
