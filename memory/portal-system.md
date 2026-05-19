---
title: Portal System
type: note
permalink: portal-system
tags: [architecture, component, react-native]
---

# Portal System

## Observations

- [decision] Custom context-based portal to replace RN `Modal` — Modal blocks ALL touches underneath
- [native] `PortalContext.ts` — key-based API: `setContent(key, content)` with Map storage
- [native] `Portal.native.tsx` — uses `useId()` for unique keys, registers content in context
- [native] `PortalProvider.native.tsx` — renders all portal content in absolute layer (zIndex 9999)
- [web] `Portal.web.tsx` — uses `createPortal(children, document.body)` — no PortalProvider needed
- [setup] PortalProvider wraps app root in all 3 mobile apps (`_layout.tsx`, `App.tsx`)
- [used-by] BottomSheet renders its overlay + panel through Portal on native
- [lesson] RN Modal is unusable for overlays that need interaction with content behind them
- [lesson] Key-based Map allows multiple portals simultaneously (e.g. nested BottomSheets)

## Relations

- used_by [[BottomSheet Touch System Lessons]]
- replaces [[React Native Modal]]
- different_on [[Cross-Platform File Extension Split]]
