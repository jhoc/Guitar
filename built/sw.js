"use strict";
var cacheName = 'hello-pwa';
var filesToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/built/main.js',
    '/built/Diagram.js',
    '/built/diagramList.js',
    '/built/diagramOptionsSelector.js',
    '/built/DiagramSelector.js',
    '/built/helper.js',
    '/built/logicDiagramEditor.js',
    '/built/logicDiagramList.js',
    '/built/MusicDefinitions.js'
];
/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(cacheName).then(function (cache) {
        return cache.addAll(filesToCache);
    }));
});
/* Serve cached content when offline */
self.addEventListener('fetch', function (e) {
    e.respondWith(caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
    }));
});
//# sourceMappingURL=sw.js.map