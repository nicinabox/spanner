/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const ASSETS = [...build, ...files];
const CACHE = `spanner-${version}`;

// Precache app shell on install
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
	);
	self.skipWaiting();
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
			.then(() => self.clients.claim())
	);
});

// Network-first for navigations, fall back to cache or offline page
self.addEventListener('fetch', (event) => {
	const { request } = event;

	if (request.method !== 'GET' || request.mode !== 'navigate') return;

	event.respondWith(
		(async () => {
			const cached = await caches.match(request);
			try {
				const response = await fetch(request);
				if (response.ok) {
					const clone = response.clone();
					const cache = await caches.open(CACHE);
					cache.put(request, clone);
				}
				return response;
			} catch {
				return cached || (await caches.match('/offline.html'));
			}
		})()
	);
});
