self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('denuncia-cache').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles/styles.css',
                '/scripts/scripts.js',
                '/login.html',
                '/cadastro.html',
                '/perfil.html',
                '/manifest.json',
                '/android/mipmap-mdpi/ic_launcher.png',
                '/android/mipmap-hdpi/ic_launcher.png',
                '/android/mipmap-xhdpi/ic_launcher.png',
                '/android/mipmap-xxhdpi/ic_launcher.png',
                '/android/mipmap-xxxhdpi/ic_launcher.png',
                '/offline.html' // Página de fallback offline
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                return caches.match('/offline.html'); // Retorna a página de fallback offline
            });
        })
    );
});