const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  console.log("putInCache", request, response);
  await cache.put(request, response);
};

const cacheFirst = async (request, event) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  // remove the Range header first
  const responseFromNetwork = await fetch(request, { headers: { Range: undefined } });
  event.waitUntil(putInCache(request, responseFromNetwork.clone()));
  return responseFromNetwork;
};

self.addEventListener("fetch", async (event) => {
  if (event.request.destination === 'audio') {
    const responseFromCache = await caches.match(event.request);
    if (responseFromCache) {
      return responseFromCache;
    }
    else {
      return;
    }
  }
  return;
});