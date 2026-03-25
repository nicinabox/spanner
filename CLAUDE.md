# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spanner is a vehicle tracking and maintenance application with a Ruby on Rails API backend and a SvelteKit frontend. This is a monorepo with three main directories:

- `api/` - Ruby on Rails 8.0 API (port 3001)
- `web/` - Legacy Next.js 13 frontend (port 3000) - **deprecated**
- `web-v4/` - Current SvelteKit 5 frontend (port 5173) - **active development**

## Development Commands

### Running the Application

Use the root-level dev script to start both API and web servers:
```bash
./dev.sh
```

Or run individually:

```bash
# API (port 3001)
cd api && bundle exec rails server -p 3001

# Web-v4 (port 5173)
cd web-v4 && npm run dev
```

### API (Ruby on Rails)

```bash
cd api
bundle install              # Install dependencies
rails db:create db:migrate  # Setup database
rails console               # Open Rails console
rails test                  # Run all tests
rails test test/models/vehicle_test.rb  # Run single test file
rubocop                     # Lint code
```

### Web-v4 (SvelteKit)

```bash
cd web-v4
npm install
npm run dev                 # Start dev server
npm run build               # Build for production
npm run check               # Type check with svelte-check
npm run lint                # Run ESLint and Prettier checks
npm run format              # Format with Prettier
npm run test                # Run all Vitest tests (browser + node)
npm run test:unit -- --run  # Run only unit tests
```

### Web (Legacy Next.js - Deprecated)

```bash
cd web
yarn install
yarn dev                    # Start dev server (port 3000)
yarn build                  # Build for production
yarn lint                   # Run ESLint
yarn test                   # Run Jest tests
```

## Architecture

### API Layer (`web-v4/src/lib/data/`)

The data layer uses a custom API client built around `fetch`:

- `client.ts` - Core HTTP client with automatic snake_case/camelCase conversion
- `config.ts` - API configuration (baseUrl: http://localhost:3001)
- Domain-specific modules: `vehicles.ts`, `records.ts`, `reminders.ts`, `session.ts`, `user.ts`, `history.ts`

All API requests require an auth token passed via `RequestOpts`:
```typescript
import { getAllVehicles } from '$lib/data/vehicles';
const vehicles = await getAllVehicles({ authToken: locals.authToken });
```

### Authentication

Token-based authentication using iron-session:
- Session cookie stores auth token sealed with `CLIENT_SECRET`
- Server hook (`src/hooks.server.ts`) protects `/vehicles` routes
- Login flow: email → magic link → session creation → redirect to `/vehicles`

### Form Handling

Server-side form actions with SvelteKit:
```typescript
// +page.server.ts
export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    // Validate and call API
    // Return fail(422, errors) on error
    // throw redirect(303, '/path') on success
  }
};
```

Client-side forms use `enhance` with progressive enhancement fallback.

### Styling

- Tailwind CSS 4 with DaisyUI 5 components
- Custom theme variables in `app.css`
- Component variants use `tailwind-variants`

## Project Structure

```
web-v4/
├── src/
│   ├── routes/           # SvelteKit file-based routing
│   │   ├── +page.svelte  # Root page (login)
│   │   ├── vehicles/     # Vehicle routes
│   │   └── logout/
│   ├── lib/
│   │   ├── components/   # Svelte components
│   │   │   ├── ui/       # Base UI components (Button, Input, etc.)
│   │   │   ├── forms/    # Form components
│   │   │   └── views/    # Page-level view components
│   │   ├── data/         # API client and data fetching
│   │   ├── utils/        # Utility functions
│   │   └── hooks/        # Svelte hooks (client only)
│   ├── app.html          # HTML template
│   └── app.css           # Global styles
├── svelte.config.js      # SvelteKit configuration
├── vite.config.ts        # Vite + Vitest configuration
└── tsconfig.json

api/
├── app/
│   ├── controllers/v2/     # API controllers (versioned)
│   ├── models/           # ActiveRecord models
│   ├── serializers/      # JSON serializers
│   └── views/            # Email templates
├── config/routes.rb      # Route definitions
├── db/
│   ├── migrate/           # Database migrations
│   └── schema.rb         # Current schema
└── test/                 # Rails tests
```

## Key Conventions

### TypeScript Types

API response types in `web-v4/src/lib/data/*.ts`:
- Use `CreatableFields<T>` and `UpdatableFields<T>` for API payloads
- Excludes `id`, `createdAt`, `updatedAt` from mutations

### API Versioning

API uses versioned Accept header: `Accept: application/vnd.api+json; version=2`

### Testing

Vitest with browser mode for component tests:
- Client tests: Browser environment with Playwright
- Server tests: Node environment
- Svelte component tests: `*.svelte.test.ts`

### Environment Variables

Web-v4 (in `.env` or `.env.local`):
- `CLIENT_SECRET` - Required for iron-session

API (in `.env`):
- Standard Rails database config
- `POSTMARK_API_TOKEN` - For email sending
