---
title: Netlify CLI Deploy Mechanics - Research
type: note
permalink: financial-app/memory/netlify-cli-deploy-mechanics-research
---

# Netlify CLI Deploy Mechanics Research

**Research date**: 2025-05-27
**Source**: Netlify CLI GitHub repository (opensrc/repos/github.com/netlify/cli)

## Summary

Investigation of the Netlify CLI `deploy` command to understand how `--cwd`, `--no-build`, `--dir`, `--functions`, and `netlify.toml` configuration are resolved.

## Key Findings

### 1. How `--cwd` Affects Path Resolution

**File**: `src/commands/base-command.ts:595-604`

When `--cwd` flag is provided:
```ts
if (flags.cwd) {
  const resolvedCwd = resolve(flags.cwd)
  this.workingDir = resolvedCwd
  
  if (resolvedCwd === processCwd) {
    delete flags.cwd
    this.workingDir = processCwd
  }
}
```

- `--cwd` is resolved to an absolute path
- Sets `this.workingDir` to the specified directory
- If it matches `process.cwd()`, the flag is deleted (treated as if not provided)

**Critical line**: `src/commands/base-command.ts:702`
```ts
cwd: flags.cwd ? this.workingDir : this.jsWorkspaceRoot || this.workingDir,
```

This is passed to `@netlify/config`'s `resolveConfig()` function:
- **With `--cwd`**: Uses the specified working directory
- **Without `--cwd`** in monorepo: Uses `jsWorkspaceRoot` if available
- **Fallback**: Uses `this.workingDir` (which is `process.cwd()` by default)

### 2. How `--no-build` Affects Deploy

**File**: `src/commands/deploy/deploy.ts:1360-1449`

When `--no-build` is used:
```ts
if (options.build) {
  // ... build path ...
} else {
  results = await prepAndRunDeploy({
    config: command.netlify.config,  // Line 1445
    // ...
  })
}
```

**What `--no-build` does:**
- **Skips build execution** via `@netlify/build`
- **Still reads `netlify.toml`** at init time (line 701-709)
- **Still reads `[functions]` section** from config (line 983)
- **Still reads `[build].publish`** section from config (line 130)

**Important**: `command.netlify.config` was already resolved during `init()` before the deploy command executes. The config path used is:
```ts
const tomlFile = join(this.workingDir, 'netlify.toml')  // Line 648
```

Where `this.workingDir` is set based on `--cwd` flag (line 595-604).

### 3. How `--dir` and `--functions` Are Resolved

**`--dir` resolution** (`src/commands/deploy/deploy.ts:109-165`):
```ts
if (options.dir) {
  deployFolder = command.workspacePackage
    ? resolve(command.jsWorkspaceRoot || site.root, options.dir)
    : resolve(command.workingDir, options.dir)
} else if (config?.build?.publish) {
  deployFolder = resolve(site.root, config.build.publish)
} else if (siteData?.build_settings?.dir) {
  deployFolder = resolve(site.root, siteData.build_settings.dir)
}
```

**Resolution order:**
1. If `--dir` flag provided: relative to `command.workingDir` (or `jsWorkspaceRoot` for monorepos)
2. If no flag: use `config.build.publish` from netlify.toml, relative to `site.root`
3. Fallback: use `siteData.build_settings.dir` from Netlify API

**`--functions` resolution** (`src/commands/deploy/deploy.ts:194-219`):
```ts
if (options.functions) {
  functionsFolder = resolve(workingDir, options.functions)
} else if (funcConfig) {
  functionsFolder = resolve(site.root, funcConfig)
} else if (siteData?.build_settings?.functions_dir) {
  functionsFolder = resolve(site.root, siteData.build_settings.functions_dir)
}
```

**Resolution order:**
1. If `--functions` flag provided: relative to `workingDir` (NOT `site.root`)
2. If no flag: use `config.functionsDirectory` from netlify.toml, relative to `site.root`
3. Fallback: use `siteData.build_settings.functions_dir` from Netlify API

**Key difference**: `--functions` is relative to `workingDir`, but `netlify.toml` `[build].functions` is relative to `site.root`.

### 4. How `[functions].directory` in `netlify.toml` Gets Resolved

**File**: `src/commands/deploy/deploy.ts:210-214`

```ts
const funcConfig = config.functionsDirectory
if (options.functions) {
  functionsFolder = resolve(workingDir, options.functions)
} else if (funcConfig) {
  functionsFolder = resolve(site.root, funcConfig)
}
```

- The config value `config.functionsDirectory` comes from `@netlify/config` parsing
- It's resolved **relative to `site.root`** (not `workingDir`)
- `site.root` comes from the netlify.toml location's parent (buildDir from resolveConfig)

### 5. File Structure Netlify Expects for Functions

Functions are discovered and packaged using **`@netlify/zip-it-and-ship-it`** (referenced in line 612).

**File patterns supported:**
- Single file: `functionName.js`, `functionName.ts` → maps to `/.netlify/functions/functionName`
- Folder with handler: `functionName/index.js` → maps to `/.netlify/functions/functionName`

**Required exports:**
- Node.js functions must export an async `handler` function
  ```ts
  export const handler = async (event, context) => { ... }
  ```

**Redirect mapping**:
- Netlify automatically routes `/.netlify/functions/server` to the file `server.js` or `server/index.js`
- This is handled by `@netlify/zip-it-and-ship-it` during packaging

### 6. Function Discovery and Directory Priority

**File**: `src/commands/deploy/deploy.ts:608-619`

Three function directories are scanned, **in priority order (rightmost wins)**:
```ts
const functionDirectories = [
  internalFunctionsFolder,                           // 1. Internal (generated, lowest priority)
  command.netlify.frameworksAPIPaths.functions.path, // 2. Framework-generated
  functionsFolder,                                    // 3. User-specified (highest priority)
].filter((folder): folder is string => Boolean(folder))
```

The rightmost directories take precedence, so user functions override framework functions.

## Path Resolution Summary Table

| Config Source | Path Resolution Base | When Used |
|---|---|---|
| `--cwd` flag | Sets `command.workingDir` | Base for netlify.toml location, `--dir`, `--functions` |
| `--dir` flag | Relative to `command.workingDir` (monorepo: `jsWorkspaceRoot`) | Direct override |
| `--functions` flag | Relative to `workingDir` | Direct override |
| `netlify.toml` `[build].publish` | Relative to `site.root` | Used when `--dir` not provided |
| `netlify.toml` `[build].functions` | Relative to `site.root` | Used when `--functions` not provided |
| Netlify API `build_settings.dir` | Absolute | Last-resort fallback |
| Netlify API `build_settings.functions_dir` | Absolute | Last-resort fallback |
| `site.root` | Based on `buildDir` from `resolveConfig()` | Reference point for toml-based paths |

## Critical Code Locations

1. **CWD handling**: `src/commands/base-command.ts:595-604` (flag parsing)
2. **Config path resolution**: `src/commands/base-command.ts:701-710` (resolveConfig call)
3. **Deploy folder logic**: `src/commands/deploy/deploy.ts:109-165` (getDeployFolder)
4. **Functions folder logic**: `src/commands/deploy/deploy.ts:194-219` (getFunctionsFolder)
5. **Deploy execution**: `src/commands/deploy/deploy.ts:1312-1450` (main deploy function)
6. **prepAndRunDeploy**: `src/commands/deploy/deploy.ts:912-1011` (where paths are used)
7. **Functions packaging**: `src/commands/deploy/deploy.ts:608-665` (functionDirectories, deploySite call)

## Important Behavioral Notes

1. **netlify.toml is always read** - even with `--no-build`, the config is loaded at init time
2. **--cwd changes the base** - all relative paths within the same command respect this
3. **Functions are scanned after static files** - functions are packaged separately using function directories
4. **No smart path inference** - paths are resolved literally; symlinks are not special-cased
5. **Multiple function directories** - Netlify can deploy from multiple locations, with user functions taking priority

## Netlify API Structure

The deploy path resolution also depends on the Netlify API's site settings:
- `build_settings.dir` - configured publish directory
- `build_settings.functions_dir` - configured functions directory
- These are used as fallbacks if not specified in netlify.toml or CLI flags

## References

- Netlify CLI version examined: GitHub repository
- Build system: `@netlify/build` and `@netlify/config`
- Function packaging: `@netlify/zip-it-and-ship-it`
