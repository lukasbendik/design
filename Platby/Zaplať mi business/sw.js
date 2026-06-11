/* Service worker — Zaplať mi business (PWA) */
var CACHE = 'zaplatmi-business-v1';
var ASSETS = [
  './',
  './index.html',
  './styl.css',
  './app.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){
    return c.addAll(ASSETS).catch(function(){ /* ignore individual fails */ });
  }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; })
        .map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

/* Network-first pro navigaci/dokumenty, fallback cache. Ostatní: cache-first s doplněním. */
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;

  if(req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') > -1){
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); });
        return res;
      }).catch(function(){
        return caches.match(req).then(function(r){ return r || caches.match('./index.html'); });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function(cached){
      return cached || fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); });
        return res;
      }).catch(function(){ return cached; });
    })
  );
});
