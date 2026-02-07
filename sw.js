/* Readify PWA Service Worker - caches assets for offline use */
const CACHE_NAME = 'readify-v1';
const ASSETS = [
  './',
  './Home_Page.html',
  './Explorer_Page.html',
  './Tracker_Page.html',
  './Recommender_page.html',
  './Flow_Page.html',
  './Feedback_Page.html',
  './Main.css',
  './Main.js',
  './readify-logo.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
