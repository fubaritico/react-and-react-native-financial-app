---
title: Fix — Disk Space and Build Artifact Cleanup
type: note
permalink: fix-disk-space-build-artifacts
tags: [fix, maintenance, how-to]
---

# Fix — Disk Space and Build Artifact Cleanup

## Observations

- [problem] Xcode DerivedData, CocoaPods cache, and Expo prebuild output can consume 5-20+ GB
- [cleanup] DerivedData (5-20+ GB, Xcode rebuilds what it needs): `rm -rf ~/Library/Developer/Xcode/DerivedData`
- [cleanup] CocoaPods cache: `pod cache clean --all`
- [cleanup] Expo generated native dirs: `rm -rf apps/mobile-expo/ios apps/mobile-expo/android`
- [cleanup] pnpm store unreferenced packages: `pnpm store prune`
- [cleanup] iOS simulator caches (resets ALL simulators): `xcrun simctl erase all`
- [shortcut] Root script handles most automatically: `pnpm reset`
- [warning] Third-party cleanup utilities may delete Xcode simulator runtimes and device trust caches — if simulator/device stops being recognized, re-download runtime in Xcode Settings > Components and re-pair device

## Relations

- related_to [[Expo SDK Alignment Lessons]]
- related_to [[Fix — Expo Native/JS Bundle Desync]]
