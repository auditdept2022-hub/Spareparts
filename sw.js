// Parts Inventory service worker (replacement, cache v74)
// - Page + assets: network first, falls back to the cached copy when offline
// - Google Apps Script / any other origin: never cached, always goes to the network
const CACHE = "parts-inventory-v74";
const CORE = [
  "./", "./index.html", "./manifest.webmanifest",
  "./favicon.png", "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./logo.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then(hit => hit || (req.mode === "navigate" ? caches.match("./index.html") : undefined))
      )
  );
});
