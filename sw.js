/* Service worker de Fichaje 10.
   Mantén CACHE alineado con VERSION_JUEGO del index.html: al subir la versión del
   juego (p. ej. v1.0 -> v1.1), cambia también aquí 'fichaje10-1.0' -> 'fichaje10-1.1'.
   Eso fuerza la actualización inmediata en los dispositivos ya instalados. */
const CACHE = 'fichaje10-1.4.2';
const ASSETS = ['./', './index.html', './stats.html', './manifest.json', './icon.svg'];

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
    // ves la última versión publicada. Sin conexión, cae a esa misma página cacheada
    // (cada página HTML del sitio se cachea bajo su propia URL, no todas bajo la
    // misma clave — con index.html y stats.html conviviendo, mezclarlas sería un bug).
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match('./index.html')))
    );
    return;
  }

  // Resto de recursos (icono, manifest, fuente): cache primero, red de reserva.
  e.respondWith(caches.match(request).then((hit) => hit || fetch(request)));
});
