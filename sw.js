const CACHE_NAME = "ag-associates-site-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./about.html",
  "./services.html",
  "./projects.html",
  "./project-details.html",
  "./design.html",
  "./bim.html",
  "./floor-plans.html",
  "./gallery.html",
  "./team.html",
  "./testimonials.html",
  "./blog.html",
  "./contact.html",
  "./quote.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./css/responsive.css",
  "./js/main.js",
  "./js/projects.js",
  "./js/gallery.js",
  "./js/quote.js",
  "./images/floor-plans/plan.svg",
  "./images/app-icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL.map(path => new URL(path, self.registration.scope))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith("ag-associates-site-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);

  if (request.method !== "GET" || requestUrl.origin !== scopeUrl.origin ||
      !requestUrl.pathname.startsWith(scopeUrl.pathname)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async response => {
          if (response.ok) {
            await caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          return cachedPage || caches.match(new URL("./index.html", scopeUrl));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(async response => {
        if (response.ok) {
          await caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
        }
        return response;
      });
    })
  );
});
