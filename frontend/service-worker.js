const CACHE_NAME = 'reuben-stream-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/style.css',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
