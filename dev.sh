#!/bin/bash

# Spanner Development Server
# Runs both the Rails API and Next.js web app concurrently

set -e

echo "🚀 Starting Spanner development servers..."

# Function to kill background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $API_PID $WEB_PID 2>/dev/null
    exit
}

# Set up cleanup on script exit
trap cleanup INT TERM EXIT

# Start Rails API in background
echo "Starting Rails API on port 3001..."
cd api
bundle exec rails server -p 3001 &
API_PID=$!
cd ..

# Give Rails a moment to start
sleep 3

# Start Next.js web app in background
echo "Starting Next.js web app on port 3000..."
cd web
yarn dev &
WEB_PID=$!
cd ..

echo "✅ Both servers are starting up..."
echo "📱 Web app: http://localhost:3000"
echo "🔌 API: http://localhost:3001"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
