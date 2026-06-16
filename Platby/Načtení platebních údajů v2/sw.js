// Service worker pro PWA instalaci (Android Chrome install prompt).
// Záměrně BEZ cache – prototyp musí být vždy živý a aktuální (viz CLAUDE.md).
// Pouze passthrough na síť, aby Chrome považoval appku za instalovatelnou.
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  // Network-only, fallback na cache neexistuje – vždy čerstvá data.
  event.respondWith(fetch(event.request));
});
