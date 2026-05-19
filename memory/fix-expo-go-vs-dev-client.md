---
title: Fix — Expo Go vs Dev Client Confusion
type: note
permalink: fix-expo-go-vs-dev-client
tags: [fix, expo, debugging, how-to]
---

# Fix — Expo Go vs Dev Client Confusion

## Observations

- [rule] If `ios/` or `android/` directories exist, `expo start` switches to dev-client mode automatically — QR code stops working with Expo Go
- [symptom] "is no longer available" when scanning QR on iPhone — `ios/` exists but no dev build installed
- [symptom] QR code opens Expo Go but crashes — SDK mismatch between app and Expo Go app
- [symptom] "Could not connect to server" — Mac and iPhone not on same Wi-Fi, or firewall blocking
- [diagnosis] Check if native dirs exist: `ls ios/ android/` — if yes, you're in dev-client mode
- [fix-expo-go] Remove native dirs to return to Expo Go mode: `rm -rf ios android`
- [fix-dev-client] Build and install dev client: `npx expo run:ios --device` then `npx expo start --dev-client`
- [principle] Never mix Expo Go and dev-client on the same device — pick one workflow
- [quick-ref] QR code (Expo Go) = no native dirs, no `--dev-client` flag
- [quick-ref] Dev build (simulator/device) = `prebuild` + `run:ios/android`, then `--dev-client`
- [commands] iPhone simulator: `pnpm expo:ios:iphone` then `npx expo start --dev-client`
- [commands] iPad simulator: `pnpm expo:ios:ipad` then `npx expo start --dev-client`
- [commands] Android emulator: `pnpm expo:android`

## Relations

- related_to [[Expo SDK Alignment Lessons]]
- related_to [[Fix — Expo Native/JS Bundle Desync]]
