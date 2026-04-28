const CACHE_NAME = 'music-page-cache-v1';
const ASSET_CACHE_NAME = 'next-assets-cache';


self.addEventListener("fetch", async (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (event.request.destination === 'audio') {
    const responseFromCache = await caches.match(event.request);
    if (responseFromCache) {
      console.log(`cache HIT for ${event.request.url}`);
      return responseFromCache;
    }
    else {
      console.log(`cache MISS for ${event.request.url}`);
      return;
    }
  }
  else if (url.pathname === '/music') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
  else if (url.origin === self.location.origin && request.referrer === "https://fictionfusion.vercel.app/music") {
    event.respondWith(
      caches.open(ASSET_CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          return response || fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }
  else {
    return;
  }
});
