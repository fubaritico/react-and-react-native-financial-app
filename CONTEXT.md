# Project Context - For AI Assistant

> This file provides context for AI assistants to quickly understand the project state.
> Share this file at the start of a new conversation to resume work efficiently.

## Project Overview

**Goal**: Build a Personal Finance mobile app based on Frontend Mentor challenge.

**Monorepo Structure**: pnpm workspaces with multiple React Native apps sharing code.

## Current State (as of 25/12/2024)

### ✅ Completed
- Screenshots analysis (7 screens identified)
- Data model defined (Balance, Transaction, Budget, Pot)
- Technical stack chosen
- Supabase project created and configured
- Architecture documented (hexagonal architecture)
- French + English documentation created

### 🔜 Next Steps
1. Create Supabase tables (SQL in `PERSONAL_FINANCE_ANALYSIS.md` section 8.3)
2. Create `design-tokens/` package with Style Dictionary
3. Create `shared/` package (api, atoms, hooks, types, utils)
4. Create `screens/` package
5. Implement Auth (Login, Sign Up)
6. Develop main screens

## Technical Stack

| Domain | Choice |
|--------|--------|
| Database + Auth | Supabase (PostgreSQL) |
| State (local) | Jotai |
| State (server) | TanStack Query |
| Navigation | Expo Router (expo apps) / React Navigation (mobile) |
| Forms | react-hook-form + zod |
| Styling | twrnc (Tailwind for RN) |
| Design Tokens | Style Dictionary (DTCG format) |

## Architecture (Hexagonal)

```
DOMAIN (shared/)           →  Business logic, 100% shared
    │
    ├── MOBILE ADAPTER     →  design-system + screens/
    │
    └── WEB ADAPTER        →  design-system-web + screens-web/ (future)
```

## Key Files

| File | Content |
|------|---------|
| `PERSONAL_FINANCE_ANALYSIS.md` | Full French documentation |
| `PERSONAL_FINANCE_ANALYSIS_EN.md` | Full English documentation |
| `.env` | Supabase credentials (gitignored) |
| `.env.example` | Template for env vars |

## Supabase Config

- **URL**: `https://lccpruqcqalxtbddggow.supabase.co`
- **Region**: Europe
- **Project**: Finance Mobile Application
- **Org**: fubaritico

## Package Structure (Target)

```
packages/
├── design-tokens/      # Style Dictionary tokens
├── design-system/      # Mobile UI components (React Native)
├── shared/             # Business logic (API, hooks, atoms, types, utils)
├── screens/            # Mobile screens (navigation agnostic)
├── mobile/             # React Navigation app
├── mobile-expo/        # Expo Router app
└── mobile-expo-ejected/# Expo Router app (ejected)
```

## Important Decisions

1. **Navigation agnostic screens**: Screens use callback props, not navigation imports
2. **Separate web UI**: `screens-web/` will be separate from `screens/` (different events: hover vs touch)
3. **Style Dictionary**: Single source of design tokens, multi-platform output
4. **Hexagonal architecture**: Domain (`shared/`) separated from UI adapters

## How to Resume Work

1. Read `PERSONAL_FINANCE_ANALYSIS.md` (or `_EN.md` for English)
2. Check the "Next Steps" section
3. Continue from where we left off

---

*Last updated: 25/12/2024*
