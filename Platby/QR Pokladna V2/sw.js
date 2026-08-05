var CACHE='qr-pokladna-v2-11';
var ASSETS=['./','./index.html','./styles.css?v=9','./app.js?v=9','./manifest.webmanifest?v=1','../../design-system/tokens.css?v=1','./icon.svg?v=1'];
self.addEventListener('install',function(event){self.skipWaiting();event.waitUntil(caches.open(CACHE).then(function(cache){return cache.addAll(ASSETS).catch(function(){});}));});
self.addEventListener('activate',function(event){event.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(key){return key!==CACHE;}).map(function(key){return caches.delete(key);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(event){
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(function(response){var copy=response.clone();caches.open(CACHE).then(function(cache){cache.put(event.request,copy);});return response;}).catch(function(){return caches.match('./index.html');}));
    return;
  }
  event.respondWith(caches.match(event.request).then(function(cached){return cached||fetch(event.request).then(function(response){if(response.ok&&new URL(event.request.url).origin===location.origin){var copy=response.clone();caches.open(CACHE).then(function(cache){cache.put(event.request,copy);});}return response;});}));
});
