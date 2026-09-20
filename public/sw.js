const CACHE_NAME = "eslavahub-shell-2026-09-20-v5";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./css/dashboard.css",
  "./css/projects.css",
  "./css/catalogs.css",
  "./css/pending-items.css",
  "./css/domains.css",
  "./img/eslava-mark.svg",
  "./img/search-console.png",
  "./img/deploy-link.webp",
  "./img/pwa-192.png",
  "./img/pwa-512.png",
  "./img/pwa-maskable-512.png",
  "./js/main.js",
  "./js/config/firebase.js",
  "./js/data/curated-projects.js",
  "./js/data/legacy-projects.js",
  "./js/data/project-portfolio-flags.js",
  "./js/data/project-repository-links.js",
  "./js/data/project-search-console-links.js",
  "./js/data/repository-pending-items.js",
  "./js/domain/constants.js",
  "./js/domain/domain-expiration.js",
  "./js/domain/firestore-cache-policy.js",
  "./js/domain/firestore-metrics.js",
  "./js/domain/state-transitions.js",
  "./js/domain/validation.js",
  "./js/domain/workspace-bootstrap.js",
  "./js/repositories/category-repository.js",
  "./js/repositories/domain-repository.js",
  "./js/repositories/firestore-repository.js",
  "./js/repositories/pending-item-repository.js",
  "./js/repositories/project-repository.js",
  "./js/repositories/project-status-repository.js",
  "./js/repositories/technology-repository.js",
  "./js/repositories/user-paths.js",
  "./js/repositories/workspace-metadata-repository.js",
  "./js/services/auth-service.js",
  "./js/services/bootstrap-service.js",
  "./js/services/curated-project-import-service.js",
  "./js/services/dashboard-service.js",
  "./js/services/legacy-migration-service.js",
  "./js/services/portfolio-enrichment-service.js",
  "./js/services/personal-project-client-backfill-service.js",
  "./js/services/project-number-service.js",
  "./js/services/project-service.js",
  "./js/services/repository-link-enrichment-service.js",
  "./js/services/repository-pending-import-service.js",
  "./js/services/search-console-enrichment-service.js",
  "./js/services/workspace-cache-service.js",
  "./js/ui/catalogs-ui.js",
  "./js/ui/dashboard-ui.js",
  "./js/ui/domains-ui.js",
  "./js/ui/pending-items-ui.js",
  "./js/ui/project-detail-ui.js",
  "./js/ui/projects-ui.js"
];

function canCache(response) {
  return Boolean(response && (response.ok || response.type === "opaque"));
}

async function cacheResponse(cache, request, response) {
  if (canCache(response)) {
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, fallbackUrl = null, preloadResponse = null) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const preloaded = preloadResponse ? await preloadResponse : null;
    if (preloaded) return cacheResponse(cache, request, preloaded);

    const response = await fetch(request);
    return cacheResponse(cache, request, response);
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;

    if (fallbackUrl) {
      const fallbackRequest = new URL(fallbackUrl, self.registration.scope).href;
      const fallback = await cache.match(fallbackRequest);
      if (fallback) return fallback;
    }

    return Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  return cacheResponse(cache, request, response);
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => cacheResponse(cache, request, response))
    .catch(() => null);

  if (cached) return cached;

  return (await networkPromise) || Response.error();
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith("eslavahub-shell-") && key !== CACHE_NAME)
              .map((key) => caches.delete(key))
          )
        ),
      self.registration.navigationPreload?.enable(),
      self.clients.claim()
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;
  const firebaseSdk =
    requestUrl.origin === "https://www.gstatic.com" &&
    requestUrl.pathname.startsWith("/firebasejs/12.19.0/");

  if (request.mode === "navigate" && sameOrigin) {
    event.respondWith(networkFirst(request, "./index.html", event.preloadResponse));
    return;
  }

  if (sameOrigin && ["script", "style", "manifest"].includes(request.destination)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (sameOrigin && request.destination === "image") {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (firebaseSdk) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
