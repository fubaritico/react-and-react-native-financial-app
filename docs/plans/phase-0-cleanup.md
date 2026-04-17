# Phase 0 — Cleanup & Restructure

## Goal

Establish the correct directory layout before any new code is written.
This phase has no new features — only moves and decisions.

## Status: TODO

---

## Step 0.1 — Decide Canonical Mobile App

**Decision already made**: `apps/mobile-expo` is canonical.
- Expo SDK 54, React 19, RN 0.81.5
- Expo Router (file-based navigation)
- Cleanest setup, no ejection complexity

`apps/mobile` and `apps/mobile-expo-ejected` are ARCHIVED.
Do not modify them. Mark for deletion once Phase 3 is validated.

---

## Step 0.2 — Create apps/ Directory and Move Canonical App

```bash
# Create apps directory
mkdir apps

# Move canonical mobile app
mv packages/mobile-expo apps/mobile  # DONE — all 3 apps moved to apps/

# Update package.json name inside apps/mobile
# Change: "name": "mobile-expo"
# To:     "name": "mobile"
```

Update `apps/mobile/metro.config.js` — the monorepoRoot path resolution
must still point to the repo root correctly after the move:

```js
const monorepoRoot = path.resolve(projectRoot, '../..'); // was correct, still correct
```

---

## Step 0.3 — Update pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Run `pnpm install` after this change to re-link workspace dependencies.

---

## Step 0.4 — Update .gitignore

Add token build output (will be needed in Phase 1):
```
packages/tokens/build/
```

---

## Step 0.5 — Verify Everything Still Runs

```bash
# Mobile app must still boot
pnpm --filter mobile start

# Design system must still resolve
# Check apps/mobile/App.tsx imports from @monorepo/design-system still work
```

---

## Completion Criteria

- [ ] `apps/mobile/` exists and boots
- [ ] `apps/mobile` (moved from packages/mobile)
- [ ] `apps/mobile-expo-ejected` (moved from packages/mobile-expo-ejected)
- [ ] `pnpm-workspace.yaml` includes `apps/*`
- [ ] `pnpm install` runs without errors
- [ ] `.gitignore` includes `packages/tokens/build/`

## Next

→ docs/plans/phase-1-tokens.md
