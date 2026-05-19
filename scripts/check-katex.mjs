import { readFileSync } from 'node:fs';
import katex from 'katex';

const SRC = 'src/routes/[lang=lang]/system/+page.svelte';
const text = readFileSync(SRC, 'utf8');

// Match any single-quoted string literal that contains a LaTeX backslash
// (i.e. authored as \\ in the JS source). This catches both branches of
// `expr={lang === 'el' ? '…' : '…'}` constructs.
const re = /'((?:[^'\\\n]|\\.)*\\\\(?:[^'\\\n]|\\.)*)'/g;

let n = 0;
let errors = 0;
for (const m of text.matchAll(re)) {
  n++;
  let expr;
  try {
    expr = JSON.parse('"' + m[1].replace(/"/g, '\\"') + '"');
  } catch (e) {
    console.error(`#${n} decode FAIL: ${m[1]}`);
    errors++;
    continue;
  }
  try {
    katex.renderToString(expr, {
      displayMode: false,
      throwOnError: true,
      // Match runtime behaviour: non-ASCII in \text{...} renders OK, just
      // warns. We care here about *parse* errors, not strict warnings.
      strict: 'ignore',
      output: 'html'
    });
    console.log(`#${n} OK  ${expr.slice(0, 80)}${expr.length > 80 ? '…' : ''}`);
  } catch (e) {
    console.error(`#${n} FAIL ${expr}`);
    console.error('     →', e.message.split('\n')[0]);
    errors++;
  }
}

console.log(`\n${n} expressions, ${errors} error(s).`);
process.exit(errors > 0 ? 1 : 0);
