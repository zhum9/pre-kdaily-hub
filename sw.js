const CACHE = "mario-growth-island-v17";
const CORE = ["/", "/app.js", "/app.css", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/apple-touch-icon-167.png", "/apple-touch-icon-152.png", "/silver-centaur-portrait.webp", "/silver-centaur-detail.webp", "/gold-centaur-portrait.webp", "/gold-centaur-detail.webp", "/tyrant-centaur-portrait.webp", "/tyrant-centaur-detail.webp", "/ok-king-portrait.webp", "/ok-king-detail.webp"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("/"))));
});
