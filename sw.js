/* Service worker de Fichaje 10.
   Mantén CACHE alineado con VERSION_JUEGO del index.html: al subir la versión del
   juego (p. ej. v1.0 -> v1.1), cambia también aquí 'fichaje10-1.0' -> 'fichaje10-1.1'.
   Eso fuerza la actualización inmediata en los dispositivos ya instalados. */
const CACHE = 'fichaje10-1.3.7';
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
