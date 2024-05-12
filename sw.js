const CACHE_NAME = 'odellisms-cache-v42.0.65';
const urlsToCache = [
  '/index.html',
  '/ODELLISMS.TXT',
];

self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
        .then(() => self.skipWaiting()) // Activate the new service worker immediately
    );
});  

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('odellisms-cache') &&
                 cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.filter(cacheName => {
            return cacheName.startsWith('odellisms-cache') &&
                    cacheName !== CACHE_NAME;
            }).map(cacheName => {
            return caches.delete(cacheName);
            })
        );
        })
        .then(() => self.clients.claim()) // Activate the new service worker immediately
        .then(() => {
        // Send a message to the client page when the new version is activated
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
            client.postMessage({ type: 'service-worker-update' });
            });
        });
        })
    );
});
  
