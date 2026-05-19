---
title: Mock Data Strategy
type: note
permalink: mock-data-strategy
tags: [architecture, testing, data]
---

# Mock Data Strategy

## Observations

- [location] `packages/shared/src/mocks/data/data.json` — single mock data file consumed by all apps
- [usage-dev] Apps use mock data for development when no API connection needed
- [usage-seed] `supabase/seed.sql` generates SQL inserts from the same data.json
- [usage-walkthrough] Onboarding walkthrough pre-fills QueryClient via `setQueryData` with mock data — zero network
- [usage-storybook] Stories use mock data for realistic component previews
- [usage-tests] MSW handlers return mock data shaped from data.json patterns
- [pattern] One source of truth for mock data — consistency across dev, test, seed, walkthrough
- [future] `POST /dev/seed` endpoint planned — dev-only, fills DB with data.json for quick testing

## Relations

- feeds [[Supabase Database Schema]]
- feeds [[Onboarding Flow Design]]
- feeds [[Testing Architecture Decisions]]
- feeds [[Storybook Architecture]]
