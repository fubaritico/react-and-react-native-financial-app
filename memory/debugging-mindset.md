---
title: Debugging Mindset
type: note
permalink: debugging-mindset
tags: [principle, debugging, lesson]
---

# Debugging Mindset

## Observations

- [principle] If something fails, NEVER accept "it can't work" — if it works in other projects, the problem is YOUR config
- [principle] Never mock entire packages to `null` as a workaround — that hides the real issue
- [principle] Never write workaround mocks when real code works elsewhere — find the root cause
- [step] Search GitHub issues, real projects, official docs for how others solve it
- [step] Trace the exact resolution chain — which file, which copy, which path
- [step] Find the root cause in the local setup (pnpm duplicates, missing config, wrong resolve order)
- [step] Fix the config, not the symptom
- [example] Jest + RN tests crashed with `__fbBatchedBridgeConfig` — initial instinct was "Jest can't test RN in monorepo". Reality: pnpm created 2 copies of react-native, preset mocks only applied to one. Fix: moduleNameMapper singleton.
- [example] Lottie animation rendered blank — initial instinct was "Lottie doesn't work with New Architecture". Reality: `lottie-react-native` v7.3 has a Fabric bug. Fix: switch to `@lottiefiles/dotlottie-react-native`.
- [example] Android API requests silently failed — initial instinct was "emulator networking is broken". Reality: Node bound to IPv6 `::1`, emulator's `10.0.2.2` needs IPv4. Fix: `app.listen(PORT, '0.0.0.0')`.

## Relations

- applied_in [[pnpm Singleton Debugging]]
- applied_in [[Splash Animation Decisions]]
- applied_in [[Android Emulator Networking]]
