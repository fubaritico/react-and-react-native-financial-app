# Command — build-tokens

Rebuild all Style Dictionary outputs from source JSON.

## Usage

```
/build-tokens
```

## When to Run

- After editing any file in packages/tokens/src/
- After a fresh clone (build/ is gitignored)
- Before building design-system or tailwind-config
- Before starting dev servers for the first time

## Command

```bash
pnpm --filter @monorepo/tokens build
```

## Watch Mode (during token development)

```bash
pnpm --filter @monorepo/tokens watch
```

## What Gets Generated

| Output | Path | Consumed by |
|--------|------|-------------|
| JS/TS tokens | packages/tokens/build/js/ | @monorepo/design-system |
| Tailwind map | packages/tokens/build/tailwind/ | @monorepo/tailwind-config |
| CSS variables | packages/tokens/build/css/ | apps/web |
| Native values | packages/tokens/build/native/ | apps/mobile (via tailwind-config) |

## Verify Output

After building, confirm these files exist:
```bash
ls packages/tokens/build/js/tokens.js
ls packages/tokens/build/tailwind/tailwind.tokens.js
ls packages/tokens/build/css/variables.css
ls packages/tokens/build/native/tokens.native.js
```

## Adding a New Token

1. Edit the appropriate `packages/tokens/src/base/*.json` file
2. If it's a semantic alias, edit `packages/tokens/src/semantic/*.json`
3. Run `/build-tokens`
4. The new token is immediately available in all consuming packages

## Troubleshooting

If build fails with "cannot find module style-dictionary":
```bash
pnpm --filter @monorepo/tokens install
pnpm --filter @monorepo/tokens build
```
