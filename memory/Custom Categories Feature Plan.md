---
title: Custom Categories Feature Plan
type: note
permalink: financial-app/custom-categories-feature-plan
tags:
- feature
- categories
- plan
---

# Custom Categories Feature Plan

## Overview
User-defined categories with icon + color, replacing hardcoded category lists. Includes removing `avatar` from transactions and `theme` from budgets.

## Key Decisions
- [decision] Category deletion blocked if referenced (409 Conflict) — user must reassign first
- [decision] Budget `theme` removed — color/icon comes from the category via CategoryDropdown
- [decision] Transaction `avatar` removed — replaced by category icon circle. Upload feature deferred.
- [decision] Add category UX: inline form below the Card (not a modal), ScrollView wraps the screen
- [decision] Delete category UX: web hover reveals trash, native onLongPress reveals trash
- [decision] Duplicate icon+color combos allowed. Only `(user_id, name)` must be unique.
- [decision] 10 system categories seeded per user (`is_system: true`, undeletable)
- [decision] Walkthrough changed from mock-data slideshow to Lottie animation with PASS button (user creates asset)

## DB Schema
- [db] New `categories` table: id, user_id, name, icon (IconName), color (hex), is_system, timestamps
- [db] `transactions`: drop `avatar` + `category` string, add `category_id` FK
- [db] `budgets`: drop `theme` + `category` string, add `category_id` FK
- [db] RPCs updated to JOIN on categories (get_budgets_with_spent, get_recurring_bills)

## Scope
- [scope] 8 sessions: DB migration, API layer, shared types + icons, UI components, CategoryDropdown + forms, categories management screen, navigation + wiring, testing + review
- [scope] Full plan in `docs/plans/custom-categories-plan.md`

## Icon Pipeline
- [icons] 35 category SVGs cleaned and registered (68 total icons)
- [icons] All category icons prefixed `category*` in iconData.ts
- [icons] Icon selector will filter `iconNames.filter(n => n.startsWith('category'))`

## Relations
- relates to [[Onboarding Flow Design]]
- relates to [[API Architecture]]
- relates to [[UI Package Architecture]]
- relates to [[Icons Data-Driven Approach]]
