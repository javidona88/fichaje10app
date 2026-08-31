/* Service worker de El Camino.
   Sube el número de versión (CACHE) cada vez que publiques cambios en index.html
   si quieres forzar la actualización inmediata en dispositivos ya instalados. */
const CACHE = 'elcamino-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const accept = request.headers.get('accept') || '';
  const isHTML = request.mode === 'navigate' || accept.includes('text/html');

  if (isHTML) {
    // La página siempre intenta la red primero: así, al recargar con conexión,
    // ves la última versión publicada. Sin conexión, cae al index cacheado.
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Resto de recursos (icono, manifest, fuente): cache primero, red de reserva.
  e.respondWith(caches.match(request).then((hit) => hit || fetch(request)));
});
