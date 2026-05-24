---
title: Onboarding Flow Design
type: note
permalink: onboarding-flow-design
tags: [feature, onboarding, architecture]
---

# Onboarding Flow Design

## Observations

- [flow] Splash -> Login/Signup -> Verify Email -> Account Activated -> Mode Choice -> Initial Balance -> Walkthrough -> Overview
- [screen] ModeChoiceScreen — user picks "bank" (GoCardless) or "manual" mode, ModeCard molecule with medallion icons
- [screen] SignupForm — shared native+web, PasswordRulesList molecule, usePasswordRules hook (3-state: pristine/valid/invalid, 6 rules)
- [screen] InitialBalanceScreen — next to build, sets starting reference balance
- [walkthrough] Slideshow of 4 real screens (Overview, Transactions, Budgets, Pots)
- [walkthrough] Isolated `QueryClientProvider` with mock data pre-filled via `setQueryData` — zero network calls, zero component changes
- [walkthrough] Adapts to any device — same components, just different data source
- [state] `user_preferences` DB table tracks: mode, has_seen_onboarding, initial_balance_set
- [state] AuthGate checks preferences to determine routing — incomplete onboarding redirects to appropriate step
- [next] TanStack Query preferences hooks + InitialBalanceScreen + routing glue

## Relations

- starts_with [[Splash Animation Decisions]]
- starts_with [[Auth Architecture]]
- chooses [[App Philosophy — Forecasting Not Ledger]]
- stores_in [[Supabase Database Schema]]
- uses [[Branding — Pouch Identity]]

- [decision] Walkthrough changed from "slideshow of 4 real screens with isolated QueryClientProvider + mock data" to a Lottie animation presentation with icons, texts, and a PASS/Skip button
- [decision] User will create the Lottie animation themselves — agent will build the WalkthroughScreen shell (Lottie player + PASS button + preferences mutation) when the asset is ready
- [flow-updated] Splash -> Login/Signup -> Verify Email -> Account Activated -> Mode Choice -> Initial Balance -> Welcome -> Walkthrough (Lottie) -> Overview
