#!/bin/bash

# Reset project script
# Simulates a fresh clone — cleans all artifacts and reinstalls everything

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

MOBILE_DIR="$ROOT_DIR/packages/mobile"
EXPO_DIR="$ROOT_DIR/packages/mobile-expo"
EJECTED_DIR="$ROOT_DIR/packages/mobile-expo-ejected"

# ---------- CLEAN ----------

echo ""
echo "=== CLEAN ==="

echo "  -> Removing all node_modules..."
find . -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "  -> Removing Expo caches..."
rm -rf "$EXPO_DIR/.expo" "$EJECTED_DIR/.expo" 2>/dev/null || true

echo "  -> Removing iOS build artifacts..."
rm -rf "$MOBILE_DIR/ios/Pods" "$MOBILE_DIR/ios/build" 2>/dev/null || true
rm -rf "$EJECTED_DIR/ios/Pods" "$EJECTED_DIR/ios/build" 2>/dev/null || true

echo "  -> Removing Android build artifacts..."
rm -rf "$MOBILE_DIR/android/build" "$MOBILE_DIR/android/.gradle" 2>/dev/null || true
rm -rf "$MOBILE_DIR/android_backup" 2>/dev/null || true
rm -rf "$EJECTED_DIR/android/build" "$EJECTED_DIR/android/.gradle" 2>/dev/null || true

echo "  -> Removing Metro / Haste caches..."
rm -rf /tmp/metro-* /tmp/haste-map-* 2>/dev/null || true

echo "  -> Removing React Native caches..."
rm -rf /tmp/react-* 2>/dev/null || true

echo "  -> Clearing Watchman watches..."
watchman watch-del-all 2>/dev/null || true

echo "  -> Clearing Xcode DerivedData for mobile projects..."
find ~/Library/Developer/Xcode/DerivedData -maxdepth 1 -name "mobile-*" -type d -exec rm -rf {} + 2>/dev/null || true
find ~/Library/Developer/Xcode/DerivedData -maxdepth 1 -name "mobileexpoejected-*" -type d -exec rm -rf {} + 2>/dev/null || true

echo "  -> Pruning pnpm store..."
pnpm store prune 2>/dev/null || true

# ---------- INSTALL ----------

echo ""
echo "=== INSTALL ==="

echo "  -> Installing dependencies..."
pnpm install --frozen-lockfile

# ---------- NATIVE REBUILD ----------

echo ""
echo "=== NATIVE REBUILD ==="

# --- packages/mobile (bare RN CLI) ---
if [ -f "$MOBILE_DIR/ios/Podfile" ]; then
  echo "  -> Installing pods for packages/mobile..."
  (cd "$MOBILE_DIR/ios" && pod install)
fi

# --- packages/mobile-expo-ejected ---
if [ -f "$EJECTED_DIR/ios/Podfile" ]; then
  echo "  -> Installing pods for packages/mobile-expo-ejected..."
  (cd "$EJECTED_DIR/ios" && pod install)
fi

# --- packages/mobile-expo (Expo managed) ---
# No native dirs — Expo Go handles native builds. Nothing to do.

# ---------- DONE ----------

echo ""
echo "=== RESET COMPLETE ==="
echo ""
echo "Next steps — launch each app to verify:"
echo "  1. pnpm --filter mobile-expo start    (then press i for iOS, a for Android)"
echo "  2. pnpm --filter mobile start         (then: pnpm --filter mobile ios:sim / android)"
echo "  3. pnpm --filter mobile-expo-ejected start"
echo ""
echo "Full post-reset checklist: docs/modus-operandi/reset.md"
echo ""
