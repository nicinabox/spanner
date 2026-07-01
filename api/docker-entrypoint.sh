#!/bin/bash
set -e

# Run pending migrations
bundle exec rails db:migrate 2>/dev/null || echo "Migration failed or already up-to-date"

# Start the server
exec "$@"
