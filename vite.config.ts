import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const devPort = Number(process.env.PORT ?? 5173);
const hmrPortEnv = process.env.HMR_PORT;
const hmrHostEnv = process.env.HMR_HOST;

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: devPort,
    strictPort: false,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    },
    hmr:
      hmrPortEnv || hmrHostEnv
        ? {
            host: hmrHostEnv,
            port: hmrPortEnv ? Number(hmrPortEnv) : undefined
          }
        : undefined,
    watch: {
      usePolling: true
    }
  },
  css: {
    devSourcemap: true
  },
  optimizeDeps: {
    force: true
  }
});
