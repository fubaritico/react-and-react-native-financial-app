---
title: Splash Animation Decisions
type: note
permalink: splash-animation-decisions
tags: [decision, animation, debugging, lesson]
---

# Splash Animation Decisions

## Observations

- [decision] Use `@lottiefiles/dotlottie-react-native` with `.lottie` format — NOT `lottie-react-native` with raw JSON
- [reason] `lottie-react-native` v7.3 renders blank with `newArchEnabled: true` (Fabric) — confirmed bug
- [decision] Use `setTimeout(4500)` for animation end detection — NOT `onComplete` or `onFrame` callbacks
- [reason] `onComplete` fires early at frame 90/120 — known DotLottie bug
- [reason] `onFrame` only reliable when JS thread has overhead (e.g. console.warn calls) — unreliable in production
- [reason] `Animated.Value` + `progress` prop freezes objects under Hermes + New Architecture
- [decision] Module-level `let splashShown = false` prevents replay on sign-out/remount
- [reason] React state resets on unmount — module-level variable survives component lifecycle
- [design] Two-level splash: native static (beige screen before JS loads) + animated Lottie (4s pouch animation)
- [design] Animation plays while session/preferences fetch happens in parallel — no wasted time
- [design] Web uses `lottie-react` (different library) loaded via `React.lazy` with `prefers-reduced-motion` support

## Relations

- blocked_by [[Lottie New Architecture Bug]]
- part_of [[Onboarding Flow Design]]
- uses [[Branding — Pouch Identity]]
