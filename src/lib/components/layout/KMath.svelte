<script lang="ts">
  import katex from 'katex';
  import 'katex/dist/katex.min.css';

  type Props = {
    expr: string;
    display?: boolean;
  };

  let { expr, display = false }: Props = $props();

  const html = $derived(
    katex.renderToString(expr, {
      displayMode: display,
      throwOnError: false,
      // Greek text inside \text{...} triggers strict-mode warnings about
      // non-ASCII codepoints; KaTeX renders them correctly anyway, so we
      // silence the noise rather than refuse to render the formula.
      strict: 'ignore',
      output: 'html'
    })
  );
</script>

{#if display}
  <div class="math-block">{@html html}</div>
{:else}
  <span class="math-inline">{@html html}</span>
{/if}

<style>
  .math-block {
    margin: var(--sp-2) 0;
    overflow-x: auto;
  }
  .math-inline {
    display: inline-block;
  }
</style>
