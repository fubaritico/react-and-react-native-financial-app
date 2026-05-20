#!/bin/bash
# Seed dev database with mock data for a test user.
# Usage: pnpm seed (from monorepo root)
#
# Reads SEED_EMAIL and SEED_PASSWORD from .env (root).
# If the API server is already running, uses it directly.
# Otherwise starts it, seeds, then stops it.
# On failure, prints the API error message and exits with code 1.

set -euo pipefail

# Load credentials from .env
ENV_FILE="$(dirname "$0")/../.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env file not found at $ENV_FILE"
  echo "Copy .env.example to .env and fill in the values."
  exit 1
fi

# Source .env (supports KEY=value and KEY='value with spaces')
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [ -z "${SEED_EMAIL:-}" ] || [ -z "${SEED_PASSWORD:-}" ]; then
  echo "ERROR: SEED_EMAIL and SEED_PASSWORD must be set in .env"
  echo "These are the credentials for the dev test user created by the seed script."
  echo "See .env.example for details."
  exit 1
fi

API_URL="http://localhost:3001"
STARTED_SERVER=false

cleanup() {
  if [ "$STARTED_SERVER" = true ]; then
    echo "Stopping API server..."
    kill "$API_PID" 2>/dev/null || true
    wait "$API_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# Check if API is already running
if curl -sf "$API_URL/health" > /dev/null 2>&1; then
  echo "API server detected on port 3001 — using existing server to seed."
  echo "Do not stop your server until seeding is complete."
else
  # Check if something else occupies port 3001
  if lsof -ti:3001 > /dev/null 2>&1; then
    echo "Port 3001 is in use but not responding to /health. Killing blocking process..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 1
  fi

  echo "Starting API server..."
  pnpm api:dev &
  API_PID=$!
  STARTED_SERVER=true

  # Wait for server to be ready (max 30s)
  TRIES=0
  until curl -sf "$API_URL/health" > /dev/null 2>&1; do
    TRIES=$((TRIES + 1))
    if [ "$TRIES" -ge 30 ]; then
      echo "ERROR: API server did not start within 30s"
      exit 1
    fi
    sleep 1
  done
  echo "API server ready."
fi

echo ""
echo "Seeding dev data..."

# Build JSON payload — use python3 for safe JSON encoding of special chars
JSON_PAYLOAD=$(python3 -c "
import json, sys
print(json.dumps({'email': sys.argv[1], 'password': sys.argv[2]}))
" "$SEED_EMAIL" "$SEED_PASSWORD")

# Capture both HTTP status and response body
HTTP_CODE=$(curl -s -o /tmp/seed-response.json -w "%{http_code}" \
  -X POST "$API_URL/dev/seed" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

BODY=$(cat /tmp/seed-response.json)
rm -f /tmp/seed-response.json

if [ "$HTTP_CODE" -ge 400 ]; then
  echo "ERROR: Seed failed (HTTP $HTTP_CODE)"
  echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
  exit 1
fi

echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
echo ""
echo "Done. You can log in with the credentials from your .env (SEED_EMAIL / SEED_PASSWORD)."
