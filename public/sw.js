const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  console.log("putInCache",request, response);
  await cache.put(request, response);
};

const cacheFirst = async (request, event) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  event.waitUntil(putInCache(request, responseFromNetwork.clone()));
  return responseFromNetwork;
};

self.addEventListener("fetch", (event) => {
  console.log("fetch", event.request);
  event.respondWith(cacheFirst(event.request, event));
});