# Rules — Features Package (packages/features)

## Screen / View Split (mandatory)

Every screen follows a two-layer architecture:

| Layer | Location | Name | Role | Storybook? |
|-------|----------|------|------|------------|
| **Screen** (container) | `apps/*/routes/` or `apps/*/app/(tabs)/` | `XxxScreen` | Hooks, mutations, callbacks, navigation, API wiring | No |
| **View** (presentational) | `packages/features/src/` | `XxxScreenView` | Pure props, JSX, no side effects | **Yes** |

### Why

- **Storybook-renderable** — the View takes only props, no QueryClient / Router / Auth needed
- **Cross-platform reuse** — same View consumed by mobile route and web route, each wiring platform-specific hooks
- **Testable** — snapshot and interaction tests on the View without mocking infrastructure
- **Separation of concerns** — data fetching and navigation stay in the app layer, presentation stays in the shared package

### Naming Convention

```
# In packages/features/
SettingsScreenView/
  SettingsScreenView.tsx          # Types + props interface (ISettingsScreenViewProps)
  SettingsScreenView.native.tsx   # RN implementation
  SettingsScreenView.web.tsx      # DOM implementation
  index.ts                        # barrel (native)
  index.web.ts                    # barrel (web)

# In apps/mobile-expo/app/(tabs)/
settings.tsx                      # export default function SettingsScreen()

# In apps/web/app/routes/
settings.tsx                      # export default function SettingsScreen()
```

### Rules

- The **View** component MUST be a pure function of its props — no `useQuery`, `useMutation`, `useNavigate`, `useRouter`, `authClient`, or any side-effect hook
- The **View** MUST receive all data and callbacks via props
- The **Screen** (route file) MUST be a thin wrapper: wire hooks, build callbacks, pass props to the View
- Route files MUST NOT contain inline JSX layout beyond rendering the View (no `<div>` grids, no `<ScrollView>` composition, no `<Typography>` headers)
- Every View MUST have a Storybook story (mandatory per project rules)
- The exported function name in route files SHOULD be `XxxScreen` (e.g., `SettingsScreen`, `BudgetsScreen`)
- The feature component MUST be `XxxScreenView` (e.g., `SettingsScreenView`, `BudgetsScreenView`)
- Interface names follow `IXxxScreenViewProps`

### What belongs where

| Concern | Screen (route) | View (feature) |
|---------|---------------|----------------|
| `useQuery` / `useMutation` | Yes | Never |
| `useNavigate` / `useRouter` | Yes | Never |
| `useCallback` (wiring) | Yes | Never |
| `authClient.*` | Yes | Never |
| `useTranslation` | Only for callback wiring | Yes (for UI labels) |
| `useModal` config builders | Yes | Never |
| Layout JSX (grid, scroll, spacing) | Never | Yes |
| `<Typography>`, `<Button>`, etc. | Never (only the View) | Yes |
| Platform-specific imports (View, ScrollView, div) | Never | Yes (via .native/.web split) |

### Example — Thin Screen wrapper

```tsx
// apps/web/app/routes/settings.tsx
import { SettingsScreenView } from '@financial-app/features'

export default function SettingsScreen() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const deleteAccount = useMutation({
    ...deleteUsersMeMutation(),
    onSuccess: () => {
      queryClient.clear()
      void authClient.signOut().then(() => void navigate('/login', { replace: true }))
    },
  })

  const handleChangeLanguage = useCallback((lang: string) => {
    void i18n.changeLanguage(lang)
  }, [i18n])

  const handleDeleteAccount = useCallback(() => {
    deleteAccount.mutate({})
  }, [deleteAccount])

  const handleDisconnect = useCallback(() => {
    void authClient.signOut().then(() => void navigate('/login', { replace: true }))
  }, [navigate])

  return (
    <SettingsScreenView
      currentLanguage={i18n.language}
      onChangeLanguage={handleChangeLanguage}
      onDeleteAccount={handleDeleteAccount}
      isDeleting={deleteAccount.isPending}
      onDisconnect={handleDisconnect}
    />
  )
}
```

## Mandatory Completion Sequence

Every new feature component, hook, or screen view MUST be followed by:

1. **Tests** — 5-level policy (see `tests.md`): happy path, variants, managed errors, unmanaged errors, edge cases
2. **`pnpm type-check && pnpm lint && pnpm test`** — all pass
3. **`/review`** — multi-agent review
4. **`/commit`** — conventional commit
5. **`/end-session`** — update session state before closing
