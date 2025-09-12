const CACHE_NAME = 'royalsmiles-v1';
const ASSETS = [
  './index.html','./services.html','./education.html','./contact.html',
  './manifest.json','./service-worker.js','./icon-192.png','./icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => {
      return resp || fetch(evt.request).then(fetchResp => {
        caches.open(CACHE_NAME).then(cache => {
          try{ cache.put(evt.request, fetchResp.clone()); } catch(e){}
        });
        return fetchResp;
      }).catch(()=> {
        if (evt.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
