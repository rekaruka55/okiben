// Offline copy of the published page. Copied next to index.html by encrypt.mjs.
// Network first, so a page that is online always gets the latest version; the cache is only the fallback.
// Every version shares one origin (rekaruka55.github.io), so caches are named with this version's prefix
// and only this version's old caches are removed.
const PREFIX = "okiben-";
const CACHE = PREFIX + "mwkl25o0";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add("./")));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req)
    .then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })
    .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match("./"))));
});
