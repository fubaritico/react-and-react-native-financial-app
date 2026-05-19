---
title: BottomSheet Touch System — RN Lessons
type: note
permalink: bottomsheet-touch-system-lessons
tags: [debugging, react-native, lesson, touch]
---

# BottomSheet Touch System — RN Lessons

## Observations

- [problem] Switching between two BottomSheets (e.g. Sort -> Filter) requires 2 taps on native
- [reason] RN does NOT have event bubbling like DOM — touch goes to topmost view in hit-test, period
- [lesson] `pointerEvents="box-none"` only skips the View itself — does NOT pass touches to sibling Views
- [lesson] `onStartShouldSetResponder` negotiates between a view and its ancestors, not siblings
- [lesson] Overlay Pressable blocks everything behind it — no CSS `pointer-events: none` + `onclick` equivalent in RN
- [lesson] `overflow: visible` does NOT work on iOS to show content outside a 0-height parent — RN clips regardless
- [attempted] pointerEvents="box-none" on overlay — doesn't pass to siblings
- [attempted] onStartShouldSetResponder returning false — responder only bubbles to parent
- [attempted] overflow: visible with 0-height container — iOS clips content
- [attempted] Single-slot portal replacing Map — same touch issue
- [attempted] pointerEvents="none" with measureInWindow click-away — unreliable
- [decision] Accepted 2-tap as standard behavior — with visible overlay (black 50%), the UX is clear
- [pattern] Custom Portal system replaced RN `Modal` which blocks ALL touches underneath
- [pattern] Portal uses context-based key API: `setContent(key, content)` with `useId()` for unique keys

## Relations

- teaches [[React Native Touch System]]
- part_of [[BottomSheet Component]]
- differs_from [[Web Event Bubbling]]
