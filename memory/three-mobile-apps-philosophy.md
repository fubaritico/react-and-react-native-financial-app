---
title: Why Three Mobile Apps
type: note
permalink: three-mobile-apps-philosophy
tags: [decision, architecture, learning]
---

# Why Three Mobile Apps

## Observations

- [decision] Three mobile apps kept side by side: bare RN CLI, Expo managed, Expo ejected
- [reason] Compare approaches — understand tradeoffs between bare RN, Expo managed, and ejected workflows
- [reason] Learning tool — seeing the same app built three ways reveals what each approach gives and takes
- [canonical] Only `mobile-expo` (Expo managed) will be published — it's the primary development target
- [reference] `mobile` (bare RN CLI) and `mobile-expo-ejected` may be aligned from time to time
- [rule] Never delete any of the three — all are intentional
- [rule] All three must be covered by ESLint and project tooling
- [consequence] More maintenance overhead — but the educational value justifies it
- [consequence] Some troubleshooting knowledge is specific to bare RN (code signing, DerivedData) vs Expo (prebuild, dev-client)

## Relations

- contains [[Monorepo Structure]]
- motivates [[Wireless Debugging Decision]]
- motivates [[Fix — Expo Go vs Dev Client]]
- motivates [[Fix — Xcodebuild Errors]]
