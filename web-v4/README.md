# Spanner Web (v4)

Next-generation frontend for Spanner — a vehicle tracking and maintenance application. Built with SvelteKit 2 and Svelte 5 (runes mode).

## Stack

- **Framework**: SvelteKit 2 with Svelte 5
- **Language**: TypeScript 6
- **Styling**: Tailwind
- **Auth**: iron-session (cookie-based)
- **API Client**: Custom fetch wrapper with camelcase/snakecase conversion
- **Testing**: Vitest
- **Formatting**: Prettier

## Prerequisites

- Node.js 22.19.0+
- npm
- Spanner API running on port 3001 (see `/api` in the repo root)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:5173` and proxies API requests to `http://localhost:3001`.

## Environment Variables

Create a `.env` file (or use `.env.development` for defaults):

| Variable        | Purpose                            | Required                               |
| --------------- | ---------------------------------- | -------------------------------------- |
| `CLIENT_SECRET` | iron-session cookie encryption key | Yes                                    |
| `API_URL`       | API backend URL                    | Yes (default: `http://localhost:3001`) |

Generate a secret:

```bash
openssl rand -base64 32
```

## Project Structure

```
src/
├── app.css              # Global styles
├── app.d.ts             # App type declarations (Locals with authToken + session)
├── app.html             # HTML shell
├── hooks.server.ts      # Server hooks (auth guard for protected routes)
├── lib/
│   ├── assets/          # Static assets (favicon, etc.)
│   ├── components/
│   │   └── forms/
│   │       └── SigninForm.svelte   # Magic link sign-in form
│   ├── data/            # API client + data modules
│   │   ├── client.ts    # Fetch wrapper with auth + camelcase/snakecase
│   │   ├── config.ts    # API config (base URL, headers)
│   │   ├── classifications.ts
│   │   ├── history.ts
│   │   ├── reminders.ts
│   │   ├── session.ts  # Session create + signin
│   │   ├── user.ts
│   │   └── vehicles.ts
│   ├── utils/           # Utility functions
│   │   ├── actions.ts   # Form action helpers
│   │   ├── async.ts     # Async utilities
│   │   ├── date.ts      # Date formatting
│   │   ├── number.ts    # Number formatting
│   │   ├── records.ts
│   │   ├── reminders.ts
│   │   ├── session.ts   # Cookie-based session management
│   │   ├── sortable.ts
│   │   ├── text.ts
│   │   └── vehicle.ts
│   └── index.ts
└── routes/
    ├── +layout.svelte   # Root layout (favicon, HEAD_INJECTIONS)
    ├── +page.server.ts  # Home page server actions (sign-in flow)
    └── +page.svelte     # Home page
```

## API Integration

The app communicates with the Spanner API through a custom fetch wrapper in `src/lib/data/client.ts`. Key features:

- **Auth**: API token is passed as `Authorization: Token <token>` header
- **Case conversion**: Request bodies are snake_cased, responses are camelCased (via `snakecase-keys` and `camelcase-keys`)
- **Error handling**: Non-2xx responses throw `HTTPError` with parsed error data
- **Type safety**: Each data module exports typed interfaces matching the API response shape

### Data Modules

Each resource has a corresponding module in `src/lib/data/`:

```typescript
import { createAPIRequest } from './client';
const request = createAPIRequest();

// Example: list vehicles
const vehicles = await request<Vehicle[]>('/vehicles');

// Example: create a record
const record = await request<Record>('/vehicles/1/records', {
	method: 'POST',
	json: { date: '2025-07-14', notes: 'Oil change', mileage: 85000 },
});
```

## Auth Flow

1. User enters email on the home page
2. Server action calls `POST /sessions` on the API, which sends a magic link email
3. User clicks the link, which redirects to the app with a login token
4. Server action calls `GET /login/:token` to exchange the token for a session
5. Session is stored in an iron-session cookie
6. `hooks.server.ts` checks the cookie on every request and redirects unauthenticated users away from protected routes

Protected routes are defined in `hooks.server.ts`:

```typescript
const protectedRoutes = ['^/vehicles'];
```

## Development

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run check            # Type check
npm run lint             # Prettier check
npm run format           # Prettier format
npm run test             # Run tests
```

## Testing

Tests use Vitest with Playwright for browser component testing:

```bash
npm run test             # Run all tests
npm run test:unit -- --run  # Run once (CI)
```

Test files are co-located with their components:

- `src/**/*.svelte.{test,spec}.{js,ts}` — browser tests
- `src/**/*.{test,spec}.{js,ts}` — server/unit tests

## Related

- [API README](../api/README.md) — Backend API documentation
- [Root README](../README.md) — Project overview and monorepo setup
