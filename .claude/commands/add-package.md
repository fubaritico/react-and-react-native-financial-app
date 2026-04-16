# Command — add-package

Scaffold a new workspace package from scratch.

## Usage

```
/add-package [package-name] [type: lib|app]
```

## Steps

### 1. Create directory
```bash
mkdir packages/[name]        # for lib
mkdir apps/[name]            # for app
```

### 2. Create package.json

For a library package:
```json
{
  "name": "@monorepo/[name]",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": { "import": "./src/index.ts" }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "@types/react": "^19.1.0"
  }
}
```

### 3. Create tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build", "dist"]
}
```

### 4. Create src/index.ts
```ts
// @monorepo/[name] public API
```

### 5. Install dependencies
```bash
# No extra config needed — pnpm-workspace.yaml picks up packages/* automatically
pnpm install
```

### 6. Add as dependency to consumer
```bash
pnpm --filter [consumer-package] add @monorepo/[name]@workspace:^
```

## Dependency Constraint Reminder

Check .claude/rules/monorepo.md for allowed dependency directions.
Packages must NEVER import from apps. Shared packages NEVER import from design-system.
