# A06 — Vulnerable and Outdated Components

OWASP Top 10 #6. Using components with known vulnerabilities.

## Checklist

### Critical

#### OWASP-A06-001: Dependencies with known critical CVEs
- **Where**: All `package.json` files, `pnpm-lock.yaml`
- **Check**: Run `pnpm audit` — any critical severity findings
- **Check**: Direct dependencies with known RCE, auth bypass, or data leak CVEs
- **Note**: Report the output of `pnpm audit --audit-level critical`

### High

#### OWASP-A06-002: Severely outdated framework versions
- **Where**: Root and workspace `package.json` files
- **Check**: Core frameworks not more than 2 major versions behind
- **Check**: Security-critical packages (express, supabase, expo) on supported versions
- **Frameworks**: React, React Native, Expo SDK, Express, Supabase client

#### OWASP-A06-003: Unmaintained dependencies
- **Where**: All `package.json` files
- **Check**: No dependencies that are archived, deprecated, or unmaintained (>2 years no release)
- **Check**: No packages with published security advisories and no fix available

#### OWASP-A06-004: Dependencies with high CVEs
- **Where**: All `package.json` files
- **Check**: Run `pnpm audit` — any high severity findings
- **Check**: Known vulnerabilities in transitive dependencies

### Medium

#### OWASP-A06-005: Missing lockfile integrity
- **Where**: `pnpm-lock.yaml`
- **Check**: Lockfile exists and is committed
- **Check**: No `resolutions` or `overrides` that mask vulnerability warnings

#### OWASP-A06-006: Unused dependencies increasing attack surface
- **Where**: All `package.json` files
- **Check**: No obviously unused packages (installed but never imported)
- **Check**: Dev dependencies not accidentally in `dependencies`

#### OWASP-A06-007: Missing Expo SDK alignment
- **Where**: `apps/mobile-expo/package.json`
- **Check**: All Expo packages aligned to current SDK version
- **Check**: Run `npx expo install --check` mentally (verify version compatibility)

### Low

#### OWASP-A06-008: Outdated dev tooling
- **Where**: Root `package.json` devDependencies
- **Check**: Linters, formatters, build tools reasonably current
- **Note**: Low security risk but can indicate unmaintained project hygiene

#### OWASP-A06-009: Missing npm provenance
- **Where**: Package installation config
- **Check**: No dependencies from unknown/untrusted registries
- **Check**: `.npmrc` doesn't point to unexpected registries

#### OWASP-A06-010: Pinned versions without update strategy
- **Where**: `package.json`, pnpm catalog
- **Check**: Dependencies use range operators (`^`, `~`) for security patches
- **Check**: Or alternatively, Dependabot/Renovate configured for updates
- **Note**: Informational — no active exploit risk
