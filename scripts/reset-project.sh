#!/bin/bash

# =============================================================================
# Reset project script
# =============================================================================
#
# Simulates a fresh clone — cleans ALL artifacts and reinstalls everything.
# Run this when builds break for no reason, after adding native deps, or when
# caches get corrupted.
#
# What it does, step by step:
#
#   1. KILL DAEMONS
#      - Stops Gradle daemon (background JVM that caches build state in memory,
#        survives rm -rf on disk caches — must be killed first or it recreates
#        corrupted caches immediately)
#      - Kills Metro bundler on port 8081 (only one can run at a time)
#
#   2. CLEAN EVERYTHING
#      - node_modules (all packages + root)
#      - .turbo (Turborepo task cache)
#      - Expo .expo cache + generated ios/ android/ dirs (expo prebuild output)
#      - iOS: Pods, build dirs, Xcode DerivedData
#      - Android: build dirs, .gradle (local), app/.cxx (CMake native cache)
#      - ~/.gradle/caches (global Gradle cache — downloaded plugins, transforms,
#        jars, kotlin-dsl metadata. Gradle re-downloads on next build. This is
#        the nuclear option but the only reliable one when CMake/fbjni refs break)
#      - Token build outputs (always regenerated)
#      - Web build outputs
#      - Metro/Haste/RN temp caches in /tmp
#      - Watchman file watches
#      - pnpm store (unreferenced packages)
#
#   3. INSTALL
#      - pnpm install (recreates node_modules from lockfile)
#      - Build tokens (downstream packages need them)
#
#   4. NATIVE REBUILD (iOS only — pods)
#      - pod install for bare RN and ejected Expo (links native deps to Xcode)
#      - Expo managed skipped (no native dirs until prebuild)
#
# After the script finishes you still need to rebuild the native binaries.
# The script prints the exact commands at the end.
#
# Usage:
#   pnpm reset
#
# =============================================================================

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

MOBILE_DIR="$ROOT_DIR/apps/mobile"
EXPO_DIR="$ROOT_DIR/apps/mobile-expo"
EJECTED_DIR="$ROOT_DIR/apps/mobile-expo-ejected"

# ---------- KILL DAEMONS ----------

echo ""
echo "=== KILL DAEMONS ==="

echo "  -> Stopping Gradle daemon (cached JVM, must die before cleaning)..."
(cd "$MOBILE_DIR/android" && ./gradlew --stop) 2>/dev/null || true

echo "  -> Killing Metro bundler (port 8081)..."
lsof -ti:8081 | xargs kill -9 2>/dev/null || true

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

echo "  -> Removing iOS build artifacts (Pods, build dirs)..."
rm -rf "$MOBILE_DIR/ios/Pods" "$MOBILE_DIR/ios/build" 2>/dev/null || true
rm -rf "$EJECTED_DIR/ios/Pods" "$EJECTED_DIR/ios/build" 2>/dev/null || true

echo "  -> Removing Android build artifacts (build, .gradle, CMake .cxx)..."
rm -rf "$MOBILE_DIR/android/build" "$MOBILE_DIR/android/.gradle" "$MOBILE_DIR/android/app/.cxx" 2>/dev/null || true
rm -rf "$MOBILE_DIR/android_backup" 2>/dev/null || true
rm -rf "$EJECTED_DIR/android/build" "$EJECTED_DIR/android/.gradle" "$EJECTED_DIR/android/app/.cxx" 2>/dev/null || true

echo "  -> Removing global Gradle caches (~/.gradle/caches — plugins, transforms, jars)..."
rm -rf ~/.gradle/caches 2>/dev/null || true

echo "  -> Removing token build outputs..."
rm -rf "$ROOT_DIR/packages/tokens/build" 2>/dev/null || true

echo "  -> Removing web build outputs..."
rm -rf "$ROOT_DIR/apps/web/build" "$ROOT_DIR/apps/web/dist" 2>/dev/null || true

echo "  -> Removing Metro / Haste / RN temp caches..."
rm -rf /tmp/metro-* /tmp/haste-map-* /tmp/react-* 2>/dev/null || true

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

echo "  -> Installing dependencies (pnpm install)..."
pnpm install --frozen-lockfile

echo "  -> Building tokens (required by tailwind-config, ui, apps)..."
pnpm tokens

# ---------- NATIVE REBUILD (pods only) ----------

echo ""
echo "=== NATIVE REBUILD (pods) ==="

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
# No native dirs until prebuild — nothing to do here.

# ---------- DONE ----------

echo ""
echo "=== RESET COMPLETE ==="
echo ""
echo "Pods are installed. Now rebuild the native binaries you need:"
echo ""
echo "  iOS (bare RN):      pnpm mobile:rebuild:ios"
echo "  Android (bare RN):  pnpm mobile:rebuild:android"
echo "  Expo iOS:           pnpm expo:rebuild:ios"
echo "  Expo Android:       pnpm expo:rebuild:android"
echo "  Web:                pnpm web:dev"
echo "  Storybook:          pnpm storybook"
echo ""
echo "First Android build after reset is slow (~5min) — Gradle re-downloads everything."
echo ""
