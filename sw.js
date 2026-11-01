const CACHE = "mario-growth-island-v30";
const CORE = [
  "/",
  "/index.html",
  "/app.js?v=30",
  "/app.css?v=30",
  "/learning/style.css?v=30",
  "/learning/view.js?v=30",
  "/learning/engine.js?v=30",
  "/learning/store.js?v=30",
  "/learning/audio.js?v=30",
  "/learning/thinking.js?v=30",
  "/content/manifest.json",
  "/content/catalog-2026.11.01-thinking.json",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/apple-touch-icon-167.png",
  "/apple-touch-icon-152.png",
  "/silver-centaur-portrait.webp",
  "/silver-centaur-detail.webp",
  "/gold-centaur-portrait.webp",
  "/gold-centaur-detail.webp",
  "/tyrant-centaur-portrait.webp",
  "/tyrant-centaur-detail.webp",
  "/ok-king-portrait.webp",
  "/ok-king-detail.webp",
  "/star-guardian/hero-avatar.webp",
  "/star-guardian/transformation-device.webp",
  "/star-guardian/hero-front.webp",
  "/star-guardian/star-blade.webp",
  "/star-guardian/hero-flying.webp",
  "/star-guardian/starlight-beam-banner.webp",
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key.startsWith("mario-growth-island-") && key !== CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin)
    return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(event.request);
        if (response.ok && response.type === "basic")
          await cache.put(event.request, response.clone());
        // Missing modules/content must never receive an HTML fallback.
        return response;
      } catch {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate")
          return (await cache.match("/")) || Response.error();
        return Response.error();
      }
    })(),
  );
});
