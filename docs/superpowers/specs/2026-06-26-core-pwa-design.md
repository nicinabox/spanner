# Core PWA Design

## Goal

Make Spanner installable as a PWA with an offline app shell. Users can add it to their home screen, and the app cold-starts offline (HTML/JS/CSS cached). Data still requires connectivity — this is not offline data support.

## Context

Current frontend (`web-v4`): SvelteKit 5 + iron-session 8. All data fetched through SvelteKit server load functions calling the Rails API. No service worker, no web manifest, no PWA configuration. App icons have been placed in `web-v4/static/icons/`.

No changes to the API, data fetching, routes, or existing pages. This is a frontend-only feature.

## Principles

1. **Installable.** Web manifest + icons so users can "Add to Home Screen" on mobile and desktop.
2. **Offline app shell.** Service worker caches the app shell (HTML, JS, CSS, static assets). App cold-starts offline. Data requires connectivity.
3. **Minimal dependencies.** Use SvelteKit's built-in service worker support (`$service-worker` module). No PWA libraries.
4. **No data changes.** All data fetching, API calls, auth flow, routes, and pages stay exactly as they are.
5. **Transparent updates.** New service worker activates immediately via `skipWaiting()`. No user prompts.

## Web Manifest

### File: `web-v4/static/manifest.json`

```json
{
  "name": "Spanner",
  "short_name": "Spanner",
  "description": "Vehicle tracking and maintenance",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "icons": [
    {
      "src": "/icons/apple-touch-icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/apple-touch-icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/apple-touch-icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

- `display: "standalone"` — opens in its own window, no browser chrome.
- `start_url: "/"` — the sign-in page. If authenticated, SvelteKit redirects to `/vehicles` as it does today.
- `theme_color` and `background_color` match the app's dark slate theme.

### Icons

Already placed in `web-v4/static/icons/`:

| File | Size | Used for |
| --- | --- | --- |
| `apple-touch-icon-192.png` | 192×192 | Manifest `purpose: "any"` |
| `apple-touch-icon-512.png` | 512×512 | Manifest `purpose: "any"` and `"maskable"` |
| `apple-touch-icon-180.png` | 180×180 | iOS apple touch icon |
| `favicon.png` | 100×100 | Favicon |
| `favicon@2x.png` | 512×512 | Favicon 2x |

### Registration in `app.html`

Add to `<head>` in `web-v4/src/app.html`:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#0f172a" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png" />
```

The `apple-touch-icon` covers iOS home screen installation. The `theme-color` meta controls the browser/address bar color on mobile.

## Service Worker

### File: `web-v4/src/service-worker.ts`

SvelteKit automatically registers a service worker when `src/service-worker.ts` exists. The `$service-worker` module provides `build`, `files`, and `version` variables.

### Caching strategy

| Asset type | Strategy | Behavior |
| --- | --- | --- |
| Build assets (JS, CSS chunks) | Precache on install | Cached when SW installs. Served from cache always. New version = new cache namespace. |
| Static files (icons, fonts, manifest, offline.html) | Precache on install | Same as build assets. |
| Navigations (HTML pages) | Network-first, cache fallback | Try network for fresh HTML. On success, update cache. If network fails, serve cached page. If offline and no cache → serve `/offline.html`. |
| API calls / SvelteKit data endpoints | Pass through (no interception) | Not cached. Data requires connectivity. |

### Implementation

```typescript
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
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate for navigations only
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET navigations (HTML pages)
  if (request.method !== 'GET' || request.mode !== 'navigate') return;

  event.respondWith(
    caches.match(request).then(async (cached) => {
      // Try network (revalidate)
      try {
        const response = await fetch(request);
        if (response.ok) {
          const clone = response.clone();
          const cache = await caches.open(CACHE);
          cache.put(request, clone);
        }
        return response;
      } catch {
        // Network failed — serve cached page or offline fallback
        return cached || caches.match('/offline.html');
      }
    })
  );
});
```

### Update behavior

- `self.skipWaiting()` on install — new SW activates immediately.
- `self.clients.claim()` on activate — new SW controls all open tabs immediately.
- Old cache version (different `version` string) is deleted on activate. No stale assets.

## Offline Fallback Page

### File: `web-v4/static/offline.html`

A minimal static HTML page served when the user navigates to a page that isn't cached:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Offline — Spanner</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #0f172a;
      color: #fff;
    }
  </style>
</head>
<body>
  <h1>You're offline</h1>
  <p>Connect to the internet to view your vehicles.</p>
</body>
</html>
```

This is a static file in `static/` so it gets precached and is always available.

## What Stays Unchanged

- **All data fetching** — Server load functions, API client, auth flow. No changes.
- **All routes and pages** — No modifications to existing pages.
- **API (Rails)** — No backend changes at all.
- **Legacy `web/` (Next.js)** — Unchanged.
- **iOS app** — Unchanged.

## Files to Create/Modify

| File | Action |
| --- | --- |
| `web-v4/src/service-worker.ts` | Create — service worker with precache + SWR navigation cache |
| `web-v4/static/manifest.json` | Create — PWA web manifest |
| `web-v4/static/offline.html` | Create — offline fallback page |
| `web-v4/src/app.html` | Modify — add manifest link, theme color, apple touch icon |

Icons are already placed in `web-v4/static/icons/`.

## Testing

- **Manual**: Load the app, disconnect network, reload — cached pages should render. Navigate to uncached page — offline.html should show.
- **Manual**: "Add to Home Screen" on iOS/Android — should install with correct icon and name.
- **Lighthouse PWA audit**: Run Chrome DevTools Lighthouse PWA check to verify installability criteria.

## Deployment

No special deployment steps. The service worker and manifest are static assets included in the standard `npm run build` output.

One consideration: the service worker is served at `/service-worker.js` (SvelteKit default). Ensure the production reverse proxy (if any) does not cache the service worker aggressively — it needs to update on each deploy. Use `Cache-Control: no-cache` for `/service-worker.js`.

## Out of scope

- Offline data caching (API responses, IndexedDB).
- Offline write support / sync queue.
- Legacy Next.js `web/` PWA support.
- Push notifications.
- Background sync.