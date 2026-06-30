const CACHE_VERSION = "v3";
const STATIC_CACHE = `toolcraft-static-${CACHE_VERSION}`;

// Precache key pages on install — use allSettled so one failure
// does not prevent the rest from being cached.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const urls = ["/en", "/zh", "/offline"];
      const results = await Promise.allSettled(
        urls.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`SW: failed to precache ${url}`, err);
            throw err;
          }),
        ),
      );
      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length) {
        console.warn(
          `SW: ${failed.length}/${urls.length} precache urls failed — continuing anyway`,
        );
      }
    }),
  );
  self.skipWaiting();
});

// Clean old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network first, then cached page, then /offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          if (resp.ok) {
            const cloned = resp.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, cloned));
          }
          return resp;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match("/offline")),
        ),
    );
    return;
  }

  // Static assets (hashed JS/CSS/fonts): cache first, network update
  if (url.pathname.match(/\.(js|css|png|jpg|svg|woff2|ico)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
        return cached || fetchPromise;
      }),
    );
    return;
  }

  // Default: network first
  event.respondWith(fetch(request));
});
