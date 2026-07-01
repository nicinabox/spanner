#!/bin/bash
set -e

# Remove stale server PID from previous run
rm -f /app/tmp/pids/server.pid

# Run pending migrations
bundle exec rails db:migrate 2>/dev/null || echo "Migration failed or already up-to-date"

# Create admin user from env vars (one-time setup)
if [ -n "${ADMIN_EMAIL:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
  if ! bundle exec rails runner "exit(User.exists?(admin: true) ? 0 : 1)" 2>/dev/null; then
    echo "Creating admin user..."
    bundle exec rails runner "
      User.create!(email: ENV['ADMIN_EMAIL'], password: ENV['ADMIN_PASSWORD'], admin: true)
      puts 'Admin user created.'
    "
  fi

  # Clear admin credentials from .env (one-time use)
  ENV_FILE="${ENV_FILE:-/app/.env}"
  if [ -f "$ENV_FILE" ]; then
    if [[ "$(uname)" == "Darwin" ]]; then
      sed -i '' '/^ADMIN_EMAIL=/d' "$ENV_FILE" 2>/dev/null || true
      sed -i '' '/^ADMIN_PASSWORD=/d' "$ENV_FILE" 2>/dev/null || true
    else
      sed -i '/^ADMIN_EMAIL=/d' "$ENV_FILE" 2>/dev/null || true
      sed -i '/^ADMIN_PASSWORD=/d' "$ENV_FILE" 2>/dev/null || true
    fi
  fi
fi

# Start the server on the configured port
PORT="${PORT:-3001}"
exec bundle exec rails server -b 0.0.0.0 -p "$PORT"
