#!/bin/bash

# Reset project script
# Simulates a fresh clone — cleans all artifacts and reinstalls everything

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

MOBILE_DIR="$ROOT_DIR/apps/mobile"
EXPO_DIR="$ROOT_DIR/apps/mobile-expo"
EJECTED_DIR="$ROOT_DIR/apps/mobile-expo-ejected"

# ---------- CLEAN ----------

echo ""
echo "=== CLEAN ==="

echo "  -> Removing all node_modules..."
find . -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "  -> Removing Turborepo caches..."
find . -name ".turbo" -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "  -> Removing Expo caches..."
rm -rf "$EXPO_DIR/.expo" "$EJECTED_DIR/.expo" 2>/dev/null || true

echo "  -> Removing mobile-expo generated native dirs (expo prebuild)..."
rm -rf "$EXPO_DIR/ios" "$EXPO_DIR/android" 2>/dev/null || true

echo "  -> Removing iOS build artifacts..."
rm -rf "$MOBILE_DIR/ios/Pods" "$MOBILE_DIR/ios/build" 2>/dev/null || true
rm -rf "$EJECTED_DIR/ios/Pods" "$EJECTED_DIR/ios/build" 2>/dev/null || true

echo "  -> Removing Android build artifacts..."
rm -rf "$MOBILE_DIR/android/build" "$MOBILE_DIR/android/.gradle" 2>/dev/null || true
rm -rf "$MOBILE_DIR/android_backup" 2>/dev/null || true
rm -rf "$EJECTED_DIR/android/build" "$EJECTED_DIR/android/.gradle" 2>/dev/null || true

echo "  -> Removing token build outputs..."
rm -rf "$ROOT_DIR/packages/tokens/build" 2>/dev/null || true

echo "  -> Removing web build outputs..."
rm -rf "$ROOT_DIR/apps/web/build" "$ROOT_DIR/apps/web/dist" 2>/dev/null || true

echo "  -> Removing Metro / Haste caches..."
rm -rf /tmp/metro-* /tmp/haste-map-* 2>/dev/null || true

echo "  -> Removing React Native caches..."
rm -rf /tmp/react-* 2>/dev/null || true

echo "  -> Clearing Watchman watches..."
watchman watch-del-all 2>/dev/null || true

echo "  -> Clearing Xcode DerivedData for mobile projects..."
find ~/Library/Developer/Xcode/DerivedData -maxdepth 1 -name "mobile-*" -type d -exec rm -rf {} + 2>/dev/null || true
find ~/Library/Developer/Xcode/DerivedData -maxdepth 1 -name "mobileexpo-*" -type d -exec rm -rf {} + 2>/dev/null || true
find ~/Library/Developer/Xcode/DerivedData -maxdepth 1 -name "mobileexpoejected-*" -type d -exec rm -rf {} + 2>/dev/null || true

echo "  -> Pruning pnpm store..."
pnpm store prune 2>/dev/null || true

# ---------- INSTALL ----------

echo ""
echo "=== INSTALL ==="

echo "  -> Installing dependencies..."
pnpm install --frozen-lockfile

echo "  -> Building tokens (required by downstream packages)..."
pnpm tokens

# ---------- NATIVE REBUILD ----------

echo ""
echo "=== NATIVE REBUILD ==="

# --- apps/mobile (bare RN CLI) ---
if [ -f "$MOBILE_DIR/ios/Podfile" ]; then
  echo "  -> Installing pods for apps/mobile..."
  (cd "$MOBILE_DIR/ios" && pod install)
fi

# --- apps/mobile-expo-ejected ---
if [ -f "$EJECTED_DIR/ios/Podfile" ]; then
  echo "  -> Installing pods for apps/mobile-expo-ejected..."
  (cd "$EJECTED_DIR/ios" && pod install)
fi

# --- apps/mobile-expo (Expo managed) ---
# No native dirs — Expo Go handles native builds. Nothing to do.

# ---------- DONE ----------

echo ""
echo "=== RESET COMPLETE ==="
echo ""
echo "Next steps — launch each app to verify:"
echo "  1. pnpm --filter mobile-expo-financial-app start    (then press i for iOS, a for Android)"
echo "  2. pnpm --filter mobile-financial-app start         (then: pnpm --filter mobile-financial-app ios:sim / android)"
echo "  3. pnpm --filter mobile-expo-ejected-financial-app start"
echo ""
echo "Full post-reset checklist: docs/modus-operandi/reset.md"
echo ""
