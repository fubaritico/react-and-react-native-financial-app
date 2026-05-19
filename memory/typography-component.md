---
title: Typography Component
type: note
permalink: typography-component
tags: [component, design-system, rule]
---

# Typography Component

## Observations

- [rule] ALL text in UI components MUST use `<Typography>` — no bare `Text` (native) or `<p>/<h1>/<span>` (web)
- [variants] 13 variants: page-title, display-lg, display, heading-xl, heading-lg, heading-md, section-title, subsection-title, body, body-bold, label, caption, caption-bold
- [colors] 10 colors: foreground, muted, on-dark, on-dark-muted, success, destructive, primary-foreground, transaction-positive, transaction-negative, beige-500
- [native] Accepts `style` prop via local `ITypographyNativeStyledProps` in .native.tsx — avoids importing RN types in the shared types file
- [web] Accepts `className` prop and `as` prop for semantic tag override (h1, h2, p, span, etc.)
- [eslint] `react-native/no-raw-text` configured with `skip: ['Typography']` in all 4 ESLint configs
- [font] Font stack: `'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, ...`
- [font] CVA base class `font-sans` applies the font — apps don't need any font setup on web
- [font-native] Expo fonts loaded separately via `expo-font` + `useFonts` — not yet fully wired
- [font-source] `@fontsource-variable/public-sans` imported in `src/index.web.ts` — registers @font-face

## Relations

- enforces [[Component Design Lessons]]
- part_of [[Styling — The Five Layers]]
- uses [[Why CVA for Variants]]
- font_from [[Branding — Pouch Identity]]
