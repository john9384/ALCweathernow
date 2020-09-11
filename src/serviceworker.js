const cache_name = "v1";

self.addEventListener("install", e => {
  console.log("service worker installed");
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cache_name) {
            console.log("Cache cleared for Update");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const res_clone = res.clone();

        caches.open(cache_name).then(cache => {
          cache.put(e.request, res_clone);
        });
        return res;
      })
      .catch(err => {
        caches.match(e.request);
      })
  );
});
