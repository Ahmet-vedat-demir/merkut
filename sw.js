// Merküt çevrimdışı önbellek: önce ağ (güncel sürüm gelsin), ağ yoksa önbellek
const ONBELLEK = 'merkut-v1';
const DOSYALAR = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(ONBELLEK).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(a => a !== ONBELLEK).map(a => caches.delete(a)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(y => { if (y.ok) { const k = y.clone(); caches.open(ONBELLEK).then(c => c.put(r, k)); } return y; }).catch(() => caches.match(r, { ignoreSearch: true }).then(y => y || caches.match('./index.html'))));
});
