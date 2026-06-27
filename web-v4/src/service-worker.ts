/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const ASSETS = [...build, ...files];
const CACHE = `spanner-${version}`;

// Precache app shell on install
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => Promise.allSettled(ASSETS.map((url) => cache.add(url))))
			.then(() => caches.open(CACHE))
			.then((cache) => cache.add('/offline'))
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

// Cache-first for navigations, fall back to network then offline page
self.addEventListener('fetch', (event) => {
	const { request } = event;

	if (request.method !== 'GET' || request.mode !== 'navigate') return;

	event.respondWith(
		(async () => {
			const cached = await caches.match(request);
			if (cached) {
				// Serve from cache immediately, revalidate in background
				fetch(request)
					.then((response) => {
						if (response.ok) {
							const clone = response.clone();
							caches.open(CACHE).then((cache) => cache.put(request, clone));
						}
					})
					.catch(() => {});
				return cached;
			}

			// No cached version — try network, fall back to offline page
			try {
				const response = await fetch(request);
				if (response.ok) {
					const clone = response.clone();
					const cache = await caches.open(CACHE);
					cache.put(request, clone);
				}
				return response;
			} catch {
				return (await caches.match('/offline')) || Response.error();
			}
		})()
	);
});
