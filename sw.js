const CACHE_NAME = 'safeher-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/dashboard.html',
  '/sos.html',
  '/grievance.html',
  '/empowerment.html',
  '/awareness.html',
  '/admin.html',
  '/css/style.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/sos.js',
  '/js/map.js',
  '/js/community.js',
  '/js/awareness.js',
  '/js/empowerment.js',
  '/js/admin.js',
  '/js/chatbot.js',
  '/js/i18n.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});
