# Spanner

A comprehensive vehicle tracking and maintenance application that helps you keep records of your vehicles and stay on top of maintenance schedules.

## Features

- **Multi-vehicle tracking** - Keep records for as many vehicles as you want
- **Smart reminders** - Email notifications for date or mileage-based maintenance
- **Mileage estimation** - Current and yearly mileage projections
- **Maintenance history** - Complete service record tracking
- **Responsive design** - Works seamlessly on desktop and mobile devices

## Architecture

This is a monorepo containing two main applications:

### `/web-v4` - Frontend Application

- **Framework**: SvelteKit 2 with Svelte 5
- **Language**: TypeScript
- **Styling**: Tailwind
- **State Management**: Svelte 5 runes
- **Authentication**: iron-session (cookie-based)
- **Testing**: Vitest

### `/api` - Backend API

- **Framework**: Ruby on Rails 8.0 (API mode)
- **Language**: Ruby 3.4.6
- **Database**: PostgreSQL
- **Server**: Puma
- **Authentication**: Token-based with email magic links

## Getting Started

### Prerequisites

- Node.js 22.19.0+
- Ruby 3.4.6
- PostgreSQL
- Yarn package manager

### Development Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/nicinabox/spanner.git
    cd spanner
    ```

2. **Setup the API**

    ```bash
    cd api
    bundle install
    rails db:create db:migrate db:seed
    rails server
    ```

3. **Setup the Web Application**

    ```bash
    cd web-v4
    npm install
    npm run dev
    ```

4. **Access the applications**
    - Frontend: http://localhost:5173
    - API: http://localhost:3001

## Self-Hosted Deployment
Run Spanner on your own infrastructure using Docker Compose.

## Prerequisites

- Docker and Docker Compose v2
- A domain or IP address to access the web interface

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/nicinabox/spanner.git
cd spanner

# 2. Run the setup script
./bin/setup

# 3. Start the services
docker compose up -d

# 4. Sign in at http://localhost:3000
```

The setup script will:

1. Generate secrets (`DB_PASSWORD`, `SECRET_KEY_BASE`, `CLIENT_SECRET`)
2. Prompt for a public URL (default `http://localhost:3000`)
3. Prompt for an admin email and password
4. Optionally configure SMTP email delivery
5. Optionally configure a notification webhook URL
6. Write everything to `.env`

On first boot, the API container automatically creates the admin user
from the credentials you provided, then clears them from `.env`.

## Configuration

### Environment Variables

All configuration lives in `.env` at the project root. The setup script
generates and prompts for most values, but you can also edit `.env`
directly.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `DB_PASSWORD` | yes | auto-generated | PostgreSQL password |
| `SECRET_KEY_BASE` | yes | auto-generated | Rails signing key |
| `CLIENT_SECRET` | yes | auto-generated | iron-session cookie secret |
| `WEB_URL` | yes | `http://localhost:3000` | Public URL for email links |
| `SMTP_HOST` | no | — | SMTP server hostname |
| `SMTP_PORT` | no | `587` | SMTP port |
| `SMTP_USERNAME` | no | — | SMTP username |
| `SMTP_PASSWORD` | no | — | SMTP password |
| `FROM_EMAIL` | no | `noreply@localhost` | Sender address for emails |
| `NOTIFICATION_WEBHOOK_URL` | no | — | Webhook URL for notifications |
| `PUBLIC_EMAIL_ENABLED` | auto | `false` | Set to `true` when SMTP is configured |

### Email

Email is optional. Without it, magic link authentication is unavailable
and the admin signs in with a password. To configure email, either:

- Run `./bin/setup` and answer "yes" to "Configure email?"
- Or set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`,
  and `FROM_EMAIL` in `.env` manually, then restart:

```bash
docker compose up -d
```

Postmark is also supported — set `POSTMARK_API_KEY` instead of SMTP vars.

### Webhook

Notification webhooks POST JSON payloads to a URL of your choice when
reminders fire. Configure via `./bin/setup` or set
`NOTIFICATION_WEBHOOK_URL` in `.env`.

## Updating

```bash
# Pull latest images and restart
docker compose pull
docker compose up -d

# Run any pending migrations
docker compose exec api rails db:migrate
```

## Architecture

Three Docker Compose services:

- **db** — PostgreSQL 16, persistent volume
- **api** — Rails 8 API (Puma), runs migrations on boot
- **web** — SvelteKit (Node), serves the frontend

The web container proxies API requests to `http://api:3001` over the
internal Docker network.

## Troubleshooting

### Login returns 401

Make sure you ran `./bin/setup` before starting the containers. The admin
user is created on first boot from the `ADMIN_EMAIL` and `ADMIN_PASSWORD`
values written to `.env` by the setup script.

If the admin wasn't created, you can create one manually:

```bash
docker compose exec api rails runner "
  User.create!(email: 'admin@example.com', password: 'yourpassword', admin: true)
"
```

### "Enter a valid email address" on login

The app accepts any `user@host` format. If you see this error, make sure
you're using a valid email format (e.g., `admin@example.com` or
`admin@localhost`).

### Port conflicts

If port 3000 or 3001 are already in use, change the host port mapping in
`docker-compose.yml`:

```yaml
ports:
  - "3000:3000"   # change to "8080:3000"
```

## Development Commands

### Web Application

```bash
cd web-v4
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Type check
npm run lint         # Prettier check
npm run format       # Prettier format
npm run test         # Run tests
```

### API Application

```bash
cd api
rails server      # Start development server
rails console     # Open Rails console
rails test        # Run tests
rails db:migrate  # Run database migrations
```

## Setup

### Environment Variables

#### Web Application

Create a `.env` file in the `web-v4` directory:

```sh
cp .env.example .env

# Generate a client secret
openssl rand -base64 32

# Update .env
CLIENT_SECRET=your_session_secret
```

| Variable               | Required | Purpose                                                                  |
| ---------------------- | -------- | ------------------------------------------------------------------------ |
| `CLIENT_SECRET`        | yes      | iron-session cookie encryption. Generate with `openssl rand -base64 32`. |
| `API_URL`              | yes      | API backend URL, e.g. `http://localhost:3001`.                           |
| `WEB_URL`              | no       | Public frontend URL for email links. Falls back to request origin.       |
| `USE_SECURE_COOKIE`    | no       | Set to `false` for plain-HTTP local testing (default: `true`).           |
| `PUBLIC_EMAIL_ENABLED` | no       | Set to `true` if the API has email configured (default: `true`).         |
| `PUBLIC_SENTRY_DSN`    | no       | Sentry DSN for error tracking.                                           |

Variables are declared in [`web-v4/src/env.ts`](web-v4/src/env.ts) using SvelteKit's experimental explicit environment variables.

#### API Application

| Variable                   | Required | Purpose                                                                                           |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`             | yes      | Postgres connection.                                                                              |
| `SECRET_KEY_BASE`          | yes      | Rails signing. Generate with `rails secret`.                                                      |
| `WEB_URL`                  | yes      | Frontend URL for email links, e.g. `http://localhost:5173`.                                       |
| `FROM_EMAIL`               | no       | Mailer from address (default: `noreply@localhost`).                                               |
| `POSTMARK_API_KEY`         | no       | Postmark for outbound email.                                                                      |
| `SMTP_HOST`                | no       | SMTP fallback for outbound email.                                                                 |
| `SMTP_PORT`                | no       | SMTP port (default: 587).                                                                         |
| `SMTP_USERNAME`            | no       | SMTP username.                                                                                    |
| `SMTP_PASSWORD`            | no       | SMTP password.                                                                                    |
| `ALLOWED_HOSTS`            | no       | Comma-separated hosts for `config.hosts` filtering. Optional — Rails allows all hosts by default. |
| `ACTIVE_STORAGE_SERVICE`   | no       | Storage backend: `amazon` (S3, default) or `local`.                                               |
| `S3_BUCKET_NAME`           | no       | S3 bucket for attachments.                                                                        |
| `S3_REGION`                | no       | S3 region (default: `us-east-1`).                                                                 |
| `S3_ACCESS_KEY_ID`         | no       | S3 access key.                                                                                    |
| `S3_SECRET_ACCESS_KEY`     | no       | S3 secret key.                                                                                    |
| `S3_ENDPOINT`              | no       | S3-compatible endpoint (non-AWS providers).                                                       |
| `S3_FORCE_PATH_STYLE`      | no       | Set `true` for non-AWS providers.                                                                 |
| `SENTRY_DSN`               | no       | Sentry DSN for error tracking.                                                                    |
| `NOTIFICATION_WEBHOOK_URL` | no       | Webhook URL for notifications.                                                                    |
| `RAILS_SERVE_STATIC_FILES` | no       | Serve static files from Rails.                                                                    |
| `RAILS_LOG_TO_STDOUT`      | no       | Stream logs to stdout.                                                                            |

## Testing

### Web Application

```bash
cd web-v4
npm run test        # Run all tests
npm run test:unit -- --run  # Run once (CI)
```

### API Application

```bash
cd api
rails test       # Run all tests
rails test test/models  # Run specific test suite
```

## Project Structure

```
spanner/
├── api/                    # Ruby on Rails API
│   ├── app/
│   ├── config/
│   ├── db/
│   ├── Gemfile
│   └── README.md
├── web-v4/                 # SvelteKit Frontend
│   ├── src/
│   ├── static/
│   ├── package.json
│   └── README.md
└── README.md              # This file
```

For detailed information about each application, see their respective README files:

- [Web Application README](web-v4/README.md)
- [API README](api/README.md)

## License

This project is licensed under the MIT License.

## Author

**Nic Haynes** - [nic@nicinabox.com](mailto:nic@nicinabox.com) - [https://nicinabox.com](https://nicinabox.com)
