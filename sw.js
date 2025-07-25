/* sw.js — network‑first for HTML */
const CACHE = 'v3';                        // <‑ bump on every release
const STATIC = [
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();                      // activate immediately
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const wantsHTML =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (wantsHTML) {
    // NETWORK‑FIRST for index.html
    e.respondWith(
      fetch(req)
        .then(r => caches.open(CACHE).then(c => { c.put(req, r.clone()); return r; }))
        .catch(() => caches.match(req))
    );
  } else {
    // CACHE‑FIRST for everything else
    e.respondWith(
      caches.match(req).then(r => r || fetch(req))
    );
  }
});
