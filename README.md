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
| `DEMO_USER`                | no       | Email treated as demo account.                                                                    |

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
