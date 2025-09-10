const CACHE_NAME = "chae-app-cache-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./manifest.json",
  "./assets/icon-180.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/heart-pop.mp3",
  "./assets/bg-music.mp3"
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => (k !== CACHE_NAME) ? caches.delete(k) : Promise.resolve())
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then(cached => cached || fetch(evt.request))
  );
});
