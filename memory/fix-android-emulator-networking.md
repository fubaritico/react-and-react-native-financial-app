---
title: Fix — Android Emulator Silent Network Failures
type: note
permalink: fix-android-emulator-networking
tags: [fix, android, debugging, how-to]
---

# Fix — Android Emulator Silent Network Failures

## Observations

- [symptom] API requests silently fail on Android emulator — no error, pages stay loading forever
- [symptom] Works fine on iOS simulator and web — only Android breaks
- [cause] Node.js `app.listen(PORT)` may bind to IPv6 `::1` only — emulator's `10.0.2.2` routes to IPv4 `127.0.0.1` which is unreachable
- [diagnosis] Check if API is reachable: `adb shell curl http://10.0.2.2:3001/health`
- [diagnosis] Check what Node bound to: `lsof -i :3001` — look for `*:3001` (all interfaces) vs `localhost:3001`
- [fix-primary] Bind explicitly to all interfaces: `app.listen(PORT, '0.0.0.0', ...)`
- [fix-secondary] Add `"usesCleartextTraffic": true` in `app.json` under `android` — allows HTTP (not HTTPS) to `10.0.2.2`
- [fix-fallback] `adb reverse tcp:3001 tcp:3001` — forwards emulator's localhost to host's localhost
- [gotcha] TanStack Query option factories called at module top level fire before `useConfigureHttpClient` sets the correct `baseUrl` (`10.0.2.2`) — query hits `localhost` which emulator can't reach
- [fix-for-gotcha] ALWAYS call option factories (e.g. `getPotsOptions()`) inside the component body, never at module scope

## Relations

- related_to [[Metro Config Monorepo Lessons]]
- caused_by [[Node IPv6 Default Binding]]
