/* sw.js — cache v2 */
const CACHE = 'v2';                       // <‑‑ bump this on every big update
const ASSETS = [
  './',           // root
  './index.html',
  './manifest.webmanifest',
  // add more static files if you create them (css, png, etc.)
];

self.addEventListener('install', event => {
  self.skipWaiting();                      // activate new SW immediately
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(
      resp => resp || fetch(event.request)
    )
  );
});
