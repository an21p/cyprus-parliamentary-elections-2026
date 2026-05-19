import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    paths: {
      // Hosted under a subpath on an21p.github.io; empty by default so
      // `npm run dev` and standalone deploys still work at the root.
      base: process.env.BASE_PATH ?? ''
    },
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true
    }),
    prerender: {
      handleHttpError: 'warn'
    },
    alias: {
      $data: 'src/lib/data',
      $components: 'src/lib/components',
      $i18n: 'src/lib/i18n'
    }
  }
};

export default config;
