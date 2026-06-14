// Service worker for static GitHub Pages hosting.
// - Cache-first for the app shell / static assets.
// - Network-first (no stale cache) for live results, so scores stay fresh.
// Scope is relative to where this file is served (./ under the repo subpath).
const CACHE = "lavermellafcb-v2";

// No serveixis mai una versió vella d'aquests recursos (dades en viu).
function isLiveData(url) {
  return url.pathname.endsWith("/results-live.json") || url.pathname.endsWith("results-live.json");
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add("./").catch(() => {}))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  // Only handle same-origin GET requests; let everything else pass through.
  if (req.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Dades en viu: network-first, sense desar còpia (mai marcador vell).
  if (isLiveData(url)) {
    event.respondWith(
      fetch(req, { cache: "no-store" }).catch(() =>
        // Si estem offline, com a últim recurs intentem el que hi pugui haver.
        caches.match(req).then((c) => c || Response.error())
      )
    );
    return;
  }

  // Resta: cache-first amb emplenat de cau.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
