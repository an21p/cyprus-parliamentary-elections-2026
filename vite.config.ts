import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    allowedHosts: ['*.trycloudflare.com', 'network-operational-salvador-forecast.trycloudflare.com'],
    hmr: {
      host: 'network-operational-salvador-forecast.trycloudflare.com',
      protocol: 'wss',
      port: 443
    }
  }
});
