// Service worker: precache app shell; file lokal memakai stale-while-revalidate.
// Naikkan CACHE saat menambah/mengganti nama file agar daftar SHELL ikut diperbarui.
const CACHE = "wheelie-v10";
const SHELL = ["./","assets/icons/apple-touch-icon.png","assets/icons/icon-192.png","assets/icons/icon-512.png","assets/icons/icon-maskable-512.png","assets/icons/icon-maskable.svg","assets/icons/icon.svg","assets/logos/honda.svg","assets/logos/suzuki.svg","assets/logos/yamaha.svg","assets/placeholders/motor-matic.svg","assets/placeholders/motor-sport.svg","assets/placeholders/motor-trail.svg","assets/placeholders/sepeda-gunung.svg","assets/placeholders/sepeda-lipat.svg","assets/placeholders/sepeda-listrik.svg","css/style.css","js/components/cards.js","js/config.js","js/data/api.js","js/data/demo.js","js/data/state.js","js/install.js","js/lib/dom.js","js/lib/format.js","js/lib/image.js","js/lib/pager.js","js/lib/storage.js","js/main.js","js/pages/about.js","js/pages/add.js","js/pages/brand.js","js/pages/brands.js","js/pages/favorites.js","js/pages/home.js","js/pages/profile.js","js/pages/vehicle.js","js/router.js","manifest.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.hostname.endsWith("supabase.co")) return; // data Supabase dicadangkan oleh api.js
  if (url.pathname.endsWith("/js/config.js")) { // konfigurasi: jaringan dulu agar perubahan .env langsung terbaca
    e.respondWith(fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return res; })
      .catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(res => {
      if (res.ok && (url.origin === location.origin || url.hostname === "cdn.jsdelivr.net")) {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => hit || caches.match("./"));
    return hit || net;
  }));
});
