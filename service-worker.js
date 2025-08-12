const CACHE_NAME = 'foodninja-v1.1';
const ASSETS = [
  '/',
  '/index.html',
  '/modern.css',
  '/main.js',
  '/icon.svg',
  '/manifest.webmanifest',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS.map(url => new Request(url, {
        cache: 'reload'
      })));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map(k => k !== CACHE_NAME && caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  
  // API requests - always network first
  if (req.url.includes('/predict') || req.url.includes('/chat') || req.url.includes('/ask_ai')) {
    e.respondWith(fetch(req));
    return;
  }
  
  // Static assets - cache first
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      
      return fetch(req).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Fallback to cached index for navigation requests
        if (req.mode === 'navigate') {
          return caches.match('/index.html');
        }
        throw new Error('Network failed and no cache available');
      });
    })
  );
});
