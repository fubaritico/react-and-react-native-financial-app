---
name: ui-track-b
description: Orchestrate UI component creation for auth and overview routes using parallel agents. Runs Storybook setup, then builds components in waves with worktree isolation where possible. Use when building the Track B UI component pipeline.
allowed-tools: Agent Read Write Edit Bash(pnpm:*) Bash(git:*) Bash(mkdir:*) Bash(ls:*)
paths:
  - packages/ui/**
  - docs/plans/ui-components-track-b.md
metadata:
  author: financial-app
  version: "1.0"
---

# Track B — UI Component Orchestration

Build all UI components for auth + overview routes using agent orchestration.
Full plan: `docs/plans/ui-components-track-b.md`

## Prerequisites

Before running this skill:
1. Read `docs/plans/ui-components-track-b.md` fully
2. Read `.claude/rules/design-system.md` and `.claude/rules/styling.md`
3. Ensure `pnpm build` passes (tokens must be built)

## Execution

### Phase 1: Storybook Setup (sequential)

Run a single agent to set up Storybook. This modifies shared config files and must
not be parallelized.

```
Agent-Setup (general-purpose):
  "Set up Storybook v10 in packages/ui/ using @storybook/react-native-web-vite.
  Read docs/plans/ui-components-track-b.md section P1 for exact steps and rationale.
  Read .claude/rules/design-system.md and .claude/rules/styling.md.

  IMPORTANT: use @storybook/react-native-web-vite (NOT @storybook/react-vite).
  This is the officially recommended framework for RN projects wanting browser Storybook.
  It provides built-in react-native-web aliasing so any react-native imports work in browser.
  Reference: https://storybook.js.org/docs/get-started/frameworks/react-native-web-vite

  Steps:
  1. Add to pnpm catalog: storybook ^10.3.5, @storybook/react-native-web-vite ^10.3.5,
     react-native-web ^0.19.13
  2. Install devDeps in packages/ui: storybook, @storybook/react-native-web-vite,
     react-native-web, react-dom (catalog), vite, postcss, autoprefixer, tailwindcss (catalog)
  3. Create packages/ui/.storybook/main.ts:
     - framework: '@storybook/react-native-web-vite'
     - stories: ['../src/**/*.stories.@(ts|tsx)']
     - viteFinal: set resolve.extensions to prioritize .web.tsx
       (so stories render web implementations by default via package exports map)
     - Import StorybookConfig type from @storybook/react-native-web-vite
  4. Create packages/ui/.storybook/preview.ts:
     - Import @financial-app/tokens/css
     - Import ./storybook.css
     - Set parameters.layout = 'centered'
  5. Create packages/ui/.storybook/storybook.css:
     - @tailwind base; @tailwind components; @tailwind utilities;
     - body { font-family: 'Public Sans', system-ui, sans-serif; }
  6. Create packages/ui/postcss.config.cjs (tailwindcss + autoprefixer)
  7. Create packages/ui/tailwind.config.cjs (extend @financial-app/tailwind-config,
     content: src/**/*.web.tsx, src/variants/**/*.ts, .storybook/**/*.{ts,tsx})
  8. Add scripts to packages/ui/package.json: storybook, storybook:build
  9. Add storybook script to root package.json
  10. Add storybook + storybook:build tasks to turbo.json
  11. Add storybook-static/ to .gitignore
  12. Run: pnpm install && pnpm build && pnpm type-check && pnpm lint

  Do NOT create stories yet. Do NOT modify any component files."
```

User verification: run `pnpm storybook` — confirm it opens at localhost:6006.

### Phase 2: Button Refactor (sequential)

```
Agent-ButtonRefactor (general-purpose):
  "Refactor the existing Button component in packages/ui to match Figma design.
  Read docs/plans/ui-components-track-b.md section P2.
  Read files/proto/screen and readme/elements/Buttons.png for visual reference.

  Update packages/ui/src/variants/button.variants.ts:
  - variant: primary (bg-grey-900 text-white), secondary (bg-beige-100 text-grey-900),
    tertiary (bg-transparent text-grey-500), destroy (bg-red text-white)
  - size: sm, md, lg (keep existing)
  - fullWidth: { true: 'w-full' }
  - disabled: { true: 'opacity-50' }

  Update Button.native.tsx and Button.web.tsx to handle new variants.
  Update/create Button.stories.tsx with Playground + Showcase showing all 4 variants.

  Run: pnpm type-check && pnpm lint && pnpm test"
```

### Phase 3: Wave 1 — Auth Primitives (sequential, dependencies between some)

Create components one at a time because PasswordInput depends on TextInput.

```
For each component in [TextInput, PasswordInput, LinkText, AuthCard, AuthLayout]:

  Agent-{ComponentName} (general-purpose):
    "Create the {ComponentName} component in packages/ui.
    Read docs/plans/ui-components-track-b.md for exact props, variants, and details.
    Read .claude/rules/design-system.md for the file structure pattern.
    Read .claude/rules/styling.md for variant rules.
    Read the relevant mockup file(s) from the Mockup Reference Map in the plan.

    Follow the /new-component skill steps exactly:
    1. Create variant file (if applicable) in src/variants/
    2. Create types file: src/components/{Name}/{Name}.tsx
    3. Create native impl: src/components/{Name}/{Name}.native.tsx
    4. Create web impl: src/components/{Name}/{Name}.web.tsx
    5. Create barrels: index.ts (re-export native), index.web.ts (re-export web)
    6. Register in src/index.ts AND src/index.web.ts
    7. Create story: src/components/{Name}/{Name}.stories.tsx
       - Import from @storybook/react-vite (not @storybook/react)
       - Playground + Showcase stories minimum

    Run: pnpm type-check && pnpm lint

    RULES:
    - No react-native imports in .web.tsx
    - No HTML elements in .native.tsx
    - No web-only classes (hover:, focus:, transition-, shadow-) in variant files
    - Use tw`` in native, cn() in web
    - Interface names must start with I (ITextInputProps)
    - No console.log, no explicit any"
```

After all 5: run `/review` on Wave 1 files, then commit.

### Phase 4: Wave 2 — Overview Primitives (parallel where possible)

**Batch A — 4 independent components (parallel worktree agents):**

```
Launch 4 agents simultaneously with isolation: "worktree":

  Agent-ColorDot (worktree): "Create ColorDot component... [same pattern as above]"
  Agent-Avatar (worktree): "Create Avatar component... [same pattern]"
  Agent-Divider (worktree): "Create Divider component... [same pattern]"
  Agent-SectionLink (worktree): "Create SectionLink component... [same pattern]"

After all complete:
  - Review each worktree's changes
  - Cherry-pick/merge component files into main branch
  - Manually register all 4 in src/index.ts + src/index.web.ts (avoid merge conflicts)
  - Run checks
```

**Batch B — 3 independent components (parallel worktree agents):**

```
  Agent-BalanceCard (worktree): "Create BalanceCard..."
  Agent-StatCard (worktree): "Create StatCard..."
  Agent-BillSummaryRow (worktree): "Create BillSummaryRow..."

→ Same merge strategy
```

**Sequential (have dependencies on Batch A):**

```
  Agent-TransactionRow: "Create TransactionRow (uses Avatar from Batch A)..."
  Agent-SpendingSummaryRow: "Create SpendingSummaryRow (uses ColorDot from Batch A)..."
  Agent-DonutChart: "Create DonutChart (SVG-based, complex)..."
```

After all Wave 2: `/review` → user validates in Storybook → commit.

### Phase 5: Wave 3 — Overview Sections (parallel worktree agents)

```
Launch 4 agents simultaneously with isolation: "worktree":

  Agent-PotsOverview: "Create PotsOverview section component..."
  Agent-TransactionsOverview: "Create TransactionsOverview section component..."
  Agent-BudgetsOverview: "Create BudgetsOverview section component..."
  Agent-RecurringBillsOverview: "Create RecurringBillsOverview section component..."

→ Merge, register in barrels, check, /review, user validates, commit
```

## Worktree Merge Strategy

Worktree agents create NEW files only (component folder + variant file + story).
They do NOT modify barrel files (src/index.ts, src/index.web.ts) — that is the
conflict zone.

After merging worktree changes:
1. A single sequential step registers all new components in both barrels
2. Runs type-check + lint to catch any issues
3. This avoids merge conflicts entirely

## Validation Checkpoints

After each wave, the user must:
1. Run `pnpm storybook`
2. Open each new component's story
3. Compare against the Figma mockup (reference map in plan doc)
4. Approve or request adjustments before moving to next wave

## Error Recovery

If a component fails type-check or lint:
1. Read the error output
2. Fix the specific file(s)
3. Re-run checks
4. Do NOT proceed to the next component until clean

If a worktree agent produces broken code:
1. Discard the worktree (`git worktree remove`)
2. Re-run the agent with more specific instructions
3. Or fall back to sequential (no worktree) for that component

## Completion

When all 3 waves + Button refactor are done:
1. Final `pnpm type-check && pnpm lint && pnpm test` from root
2. Final `pnpm storybook` — all 19+ components visible
3. All components match Figma mockups
4. Track B is ready to converge with Track A
