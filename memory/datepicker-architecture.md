---
title: DatePicker Architecture
type: note
permalink: datepicker-architecture
tags: [decision, components, architecture]
---

# DatePicker Architecture

## Observations

- [decision] Three implementations based on platform and viewport: web desktop, web mobile/tablet, native
- [web-desktop] `react-aria-components` DatePicker with segments + Popover + Calendar
- [web-mobile] `react-aria-components` Calendar standalone in BottomSheet (no segments — touch-friendly)
- [native] Pressable trigger + `@react-native-community/datetimepicker` — native OS picker
- [pattern] Switch between web-desktop and web-mobile via `useIsDesktop()` hook with live `window.matchMedia` listener
- [decision] Date library: `@internationalized/date` ONLY — no dayjs, no date-fns, no moment
- [reason] react-aria-components requires `@internationalized/date` anyway — using it everywhere avoids two date libraries
- [reason] `@internationalized/date` handles timezone-aware date math correctly (CalendarDate, CalendarDateTime, ZonedDateTime)

## Relations

- uses [[BottomSheet Component]]
- uses [[react-aria-components]]
- part_of [[Transaction CRUD Forms]]
