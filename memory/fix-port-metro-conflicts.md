---
title: Fix — Port and Metro Conflicts
type: note
permalink: fix-port-metro-conflicts
tags: [fix, metro, debugging, how-to]
---

# Fix — Port and Metro Conflicts

## Observations

- [symptom] Metro doesn't serve after `expo start` — port 8081 occupied by another Metro instance
- [symptom] App shows "Could not connect to development server" after switching between apps
- [fix] Kill leftover Metro: `lsof -ti:8081 | xargs kill -9`
- [rule] Only one Metro bundler at a time — close simulator between app switches
- [rule] Never run two apps simultaneously unless they use different ports
- [gotcha] Bare RN CLI (apps/mobile) and Expo (apps/mobile-expo) both default to port 8081 — always close one before starting the other

## Relations

- related_to [[Metro Config Monorepo Lessons]]
