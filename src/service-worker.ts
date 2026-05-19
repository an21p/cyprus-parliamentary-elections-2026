/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `cyprus2026-${version}`;

// Everything SvelteKit considers part of the build (immutable) + static assets.
const ASSETS = [...build, ...files];

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => sw.skipWaiting())
  );
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key !== CACHE) await caches.delete(key);
      }
      await sw.clients.claim();
    })()
  );
});

sw.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Build/static assets - cache-first (they're content-hashed/immutable).
  if (ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then((hit) => hit ?? fetch(req))
    );
    return;
  }

  // Navigations + everything else - network-first with cache fallback so the
  // app keeps working offline.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const fresh = await fetch(req);
        if (fresh.ok && fresh.type === 'basic') cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cached = await cache.match(req);
        if (cached) return cached;
        // Final fallback for navigations: serve the SPA shell.
        if (req.mode === 'navigate') {
          const shell = await cache.match('/');
          if (shell) return shell;
        }
        throw new Error('offline and no cache match');
      }
    })()
  );
});
