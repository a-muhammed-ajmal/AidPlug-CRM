const CACHE_NAME = 'aidplug-crm-cache-v1';
const API_CACHE_NAME = 'aidplug-crm-api-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/index.css',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
];

// Install: Caches app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened app shell cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error("Failed to cache app shell", err))
  );
});

// Activate: Cleans up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, API_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch: Handles requests
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Strategy 1: Network First for Supabase API calls
  if (requestUrl.hostname.endsWith('supabase.co')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((networkResponse) => {
            // If response is valid, cache it and return it
            if (networkResponse && networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // If network fails, try to serve from cache
            return cache.match(event.request);
          });
      })
    );
    return;
  }

  // Strategy 2: Cache First for all other requests (app shell, static assets, etc.)
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Not in cache - fetch from network, cache, and return
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response to cache
            if (!networkResponse || !networkResponse.ok || !event.request.url.startsWith('http')) {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});
