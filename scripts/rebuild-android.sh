#!/bin/bash

# =============================================================================
# Rebuild Android — one command, always works
# =============================================================================
#
# Handles everything: stops daemons, cleans all caches (Gradle, Metro, RN),
# starts Metro, rebuilds from scratch, and launches on emulator.
#
# Usage:
#   pnpm mobile:rebuild:android              # bare RN CLI — default emulator
#   pnpm mobile:rebuild:android:phone        # bare RN CLI — Small_Phone
#   pnpm mobile:rebuild:android:tablet       # bare RN CLI — Medium_Tablet
#   pnpm expo:rebuild:android                # Expo managed — default emulator
#   pnpm expo:rebuild:android:phone          # Expo managed — Small_Phone
#   pnpm expo:rebuild:android:tablet         # Expo managed — Medium_Tablet
#
# Arguments:
#   $1 — app directory (e.g. apps/mobile, apps/mobile-expo)
#   $2 — (optional) AVD device name (e.g. Small_Phone, Medium_Tablet)
#
# The first build after a full clean takes ~5 min (Gradle re-downloads deps).
# Subsequent runs reuse the global Gradle cache and finish much faster.
#
# =============================================================================

set -e

APP_DIR=""
APP_TYPE=""
DEVICE=""

# ---------- PARSE ARGS ----------

if [ -n "$1" ]; then
  APP_DIR="$1"
elif [ -f "android/settings.gradle" ]; then
  APP_DIR="$(pwd)"
elif [ -f "apps/mobile/android/settings.gradle" ]; then
  APP_DIR="$(pwd)/apps/mobile"
fi

DEVICE="${2:-}"

if [ -z "$APP_DIR" ] || [ ! -d "$APP_DIR/android" ]; then
  echo "ERROR: Cannot find android/ directory."
  echo "Run from an app dir or pass the app path as argument."
  exit 1
fi

# Detect app type
if [ -f "$APP_DIR/app.json" ] && grep -q "expo" "$APP_DIR/app.json" 2>/dev/null; then
  APP_TYPE="expo"
else
  APP_TYPE="bare"
fi

APP_NAME="$(basename "$APP_DIR")"
ANDROID_DIR="$APP_DIR/android"

DEVICE_LABEL="default emulator"
if [ -n "$DEVICE" ]; then
  DEVICE_LABEL="$DEVICE"
fi

echo ""
echo "=== REBUILD ANDROID: $APP_NAME ($APP_TYPE) → $DEVICE_LABEL ==="
echo ""

# ---------- 1. KILL DAEMONS ----------

echo "[1/6] Killing daemons..."

# Gradle daemon — must die first or it recreates caches from memory
if [ -f "$ANDROID_DIR/gradlew" ]; then
  (cd "$ANDROID_DIR" && ./gradlew --stop) 2>/dev/null || true
fi

# Kill leftover Metro on port 8081 (if any). A stale Metro process from a
# previous session can hold the port and cause a conflict. The script starts
# its own Metro in step 5. No-op if nothing is running.
lsof -ti:8081 | xargs kill -9 2>/dev/null || true

# ---------- 2. CLEAN GRADLE ----------

echo "[2/6] Cleaning Gradle (build, .gradle, .cxx)..."

rm -rf "$ANDROID_DIR/build" 2>/dev/null || true
rm -rf "$ANDROID_DIR/.gradle" 2>/dev/null || true
rm -rf "$ANDROID_DIR/app/build" 2>/dev/null || true
rm -rf "$ANDROID_DIR/app/.cxx" 2>/dev/null || true

# ---------- 3. CLEAN METRO / RN ----------

echo "[3/6] Cleaning Metro and RN caches..."

rm -rf /tmp/metro-* /tmp/haste-map-* /tmp/react-* 2>/dev/null || true
watchman watch-del-all 2>/dev/null || true

# ---------- 4. EXPO PREBUILD (if Expo) ----------

if [ "$APP_TYPE" = "expo" ]; then
  echo "[4/6] Expo prebuild --clean..."
  (cd "$APP_DIR" && npx expo prebuild --clean --platform android)
else
  echo "[4/6] Skipped (bare RN, no prebuild needed)"
fi

# ---------- 5. START METRO ----------

echo "[5/6] Starting Metro bundler in background..."

# Start Metro with a clean cache. It runs in the background so the build
# command (step 6) can connect to it. Logs go to a temp file — if something
# goes wrong, check /tmp/metro-rebuild.log.
METRO_LOG="/tmp/metro-rebuild.log"
if [ "$APP_TYPE" = "expo" ]; then
  (cd "$APP_DIR" && npx expo start --clear > "$METRO_LOG" 2>&1) &
else
  (cd "$APP_DIR" && npx react-native start --reset-cache > "$METRO_LOG" 2>&1) &
fi
METRO_PID=$!

# Wait for Metro to be ready (port 8081 open)
echo "     Waiting for Metro on port 8081..."
TRIES=0
while ! lsof -ti:8081 > /dev/null 2>&1; do
  sleep 1
  TRIES=$((TRIES + 1))
  if [ $TRIES -ge 30 ]; then
    echo "ERROR: Metro did not start within 30s. Check $METRO_LOG"
    kill $METRO_PID 2>/dev/null || true
    exit 1
  fi
done
echo "     Metro is ready (PID $METRO_PID)."

# ---------- 6. BUILD & RUN ----------

echo "[6/6] Building and launching on $DEVICE_LABEL..."

if [ -n "$DEVICE" ]; then
  # Boot the specific AVD if no emulator is running
  if ! adb devices 2>/dev/null | grep -q "emulator"; then
    echo "     Booting $DEVICE..."
    emulator -avd "$DEVICE" &
    adb wait-for-device 2>/dev/null
    # Wait for the device to finish booting (sys.boot_completed = 1)
    echo "     Waiting for device to finish booting..."
    while [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" != "1" ]; do
      sleep 1
    done
  fi
  # Forward Metro port so the emulator can reach localhost:8081
  adb reverse tcp:8081 tcp:8081
fi

if [ "$APP_TYPE" = "expo" ]; then
  if [ -n "$DEVICE" ]; then
    (cd "$APP_DIR" && npx expo run:android --device "$DEVICE")
  else
    (cd "$APP_DIR" && npx expo run:android)
  fi
else
  if [ -n "$DEVICE" ]; then
    DEVICE_ID="$(adb devices | grep emulator | head -1 | awk '{print $1}')"
    (cd "$APP_DIR" && npx react-native run-android --deviceId "$DEVICE_ID")
  else
    (cd "$APP_DIR" && npx react-native run-android)
  fi
fi

echo ""
echo "=== DONE ==="
echo ""
echo "Metro is running in background (PID $METRO_PID). Logs: $METRO_LOG"
echo "To stop it: kill $METRO_PID   or   lsof -ti:8081 | xargs kill -9"
echo ""
