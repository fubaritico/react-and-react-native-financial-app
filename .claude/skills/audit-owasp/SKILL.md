---
name: audit-owasp
description: Full-codebase OWASP Top 10 security audit using 10 parallel subagents (one per category). Produces structured JSON findings with severity scoring. Use when auditing security, checking OWASP compliance, running a security scan, or hardening the app.
allowed-tools: Agent Read Glob Grep Bash(ls:*)
metadata:
  author: financial-app
  version: "1.0"
---

# Audit OWASP — Full-Codebase Security Audit

Orchestrates 10 parallel domain-expert subagents — one per OWASP Top 10 (2021) category — to audit
the entire codebase (API + web + mobile + shared packages) for security vulnerabilities.

## Prerequisites

- `pnpm type-check && pnpm lint && pnpm test` should pass (not strictly required but recommended)
- This audit reads ALL source files — it is a deep scan, not a diff-based review

## Execution Flow

### Step 1 — Scope Detection

Scan the full codebase. Include:
- `apps/api/src/**/*.ts` (server routes, middleware, auth)
- `apps/web/src/**/*.{ts,tsx}` (web app, loaders, components)
- `apps/mobile-expo/src/**/*.{ts,tsx}` (mobile app, screens, navigation)
- `packages/shared/src/**/*.{ts,tsx}` (auth, hooks, utils)
- `packages/ui/src/**/*.{ts,tsx}` (UI components — XSS vectors)
- Config files: `*.config.*`, `app.json`, `package.json`, `.env.example`

Exclude: `node_modules/`, `build/`, `dist/`, `*.test.*`, `*.stories.*`, lock files, `*.d.ts`

### Step 2 — Load Context

Read all files in scope. Group them by layer:
- **API layer**: `apps/api/src/`
- **Web layer**: `apps/web/src/`
- **Mobile layer**: `apps/mobile-expo/src/`
- **Shared layer**: `packages/shared/src/`
- **UI layer**: `packages/ui/src/`
- **Config layer**: root configs, app.json, env examples

### Step 3 — Dispatch 10 Parallel Subagents

Launch all 10 agents simultaneously using the Agent tool. Each agent receives:
- The full file list for its relevant layers (some categories scan all layers)
- Its OWASP category reference guide from `references/`
- The JSON output schema
- Instruction to return ONLY a JSON array of findings (no prose)

Each agent prompt:
```
You are a security auditor specialized in OWASP Top 10 category [CATEGORY].
Audit the following codebase files against the checklist in the reference guide.
Return ONLY a valid JSON array of findings. No prose, no markdown fences around the JSON.
If no violations found, return an empty array: []
Each finding must follow this schema:

{
  "id": "OWASP-A0X-NNN",
  "category": "A0X-category-name",
  "severity": "critical|high|medium|low",
  "file": "relative/path/to/file.ts",
  "line": 42,
  "title": "Short description",
  "description": "Detailed explanation of the vulnerability",
  "recommendation": "How to fix it",
  "cwe": "CWE-XXX",
  "needs_verification": false,
  "verification_query": ""
}

Use severity levels:
- critical: actively exploitable, data breach risk
- high: exploitable with some effort, should fix before deploy
- medium: defense-in-depth gap, fix in next sprint
- low: best practice deviation, informational

If a finding depends on runtime behavior or library version you're not 100% certain about,
set "needs_verification": true and provide a "verification_query" for context7 lookup.
```

Agents and their scope:

| # | Agent | Prefix | Layers to audit |
|---|-------|--------|-----------------|
| 1 | Broken Access Control | OWASP-A01 | API, Web (loaders), Mobile (navigation) |
| 2 | Cryptographic Failures | OWASP-A02 | All layers |
| 3 | Injection | OWASP-A03 | API, Web (.web.tsx), UI (.web.tsx) |
| 4 | Insecure Design | OWASP-A04 | All layers |
| 5 | Security Misconfiguration | OWASP-A05 | Config, API, Web |
| 6 | Vulnerable Components | OWASP-A06 | All package.json files |
| 7 | Auth Failures | OWASP-A07 | API (auth middleware), Shared (auth), Web/Mobile (auth flows) |
| 8 | Data Integrity Failures | OWASP-A08 | All layers |
| 9 | Logging & Monitoring | OWASP-A09 | API, Shared |
| 10 | SSRF | OWASP-A10 | API, Shared (HTTP clients), Web (loaders) |

### Step 4 — Aggregate & Score

Merge all findings into a single report. Calculate scores:

```
category_score = max(0, 100 - (critical * 25) - (high * 15) - (medium * 5) - (low * 1))
```

Weights for overall score:
- A01 Broken Access Control: 15%
- A02 Cryptographic Failures: 12%
- A03 Injection: 15%
- A04 Insecure Design: 8%
- A05 Security Misconfiguration: 10%
- A06 Vulnerable Components: 8%
- A07 Auth Failures: 12%
- A08 Data Integrity Failures: 8%
- A09 Logging & Monitoring: 5%
- A10 SSRF: 7%

Verdict thresholds:
- 80-100 + no critical → `pass`
- 60-79 → `needs-hardening`
- < 60 or any critical remaining → `fail`

### Step 5 — Report to User

Present findings grouped by severity (critical first), then by OWASP category.
Format as a readable table with columns: ID | Severity | File:Line | Title | CWE

Follow with:
- Score breakdown per category
- Overall score + verdict
- Top 3 priority fixes

### Step 6 — Verify Ambiguous Findings (context7)

Before recommending fixes, check findings where `needs_verification: true`:
1. Run the `verification_query` through context7
2. If confirmed → keep finding
3. If disproved → discard, adjust score
4. Report verification results to user

### Step 7 — Remediation Guidance

For each critical/high finding, provide:
- Exact file + line to modify
- Code snippet showing the fix
- Reference to the relevant CWE

Do NOT auto-fix. Present recommendations and let the user decide.

## Output Schema

```json
{
  "audit_date": "ISO-8601",
  "scope": { "files_scanned": 0, "layers": [] },
  "findings": [ /* array of finding objects */ ],
  "scores": {
    "A01": 0, "A02": 0, "A03": 0, "A04": 0, "A05": 0,
    "A06": 0, "A07": 0, "A08": 0, "A09": 0, "A10": 0
  },
  "overall_score": 0,
  "verdict": "pass|needs-hardening|fail",
  "summary": {
    "critical": 0, "high": 0, "medium": 0, "low": 0, "total": 0
  }
}
```

## Known Accepted Risks (do NOT flag)

These are documented in CLAUDE.md "Known Issues" and are intentionally accepted:
- SEC-002: bare RN (`apps/mobile/`) uses plain AsyncStorage — learning reference, not published
- SEC-006: `redirectTo` in oauth.ts not validated — deferred until login UI complete
- ARCH-003b: factories read env vars directly — accepted DX trade-off
- Google client IDs empty in .env — pending Google Cloud Console setup
- `http://localhost` in dev configs — dev-only, not production
- `http://10.0.2.2` in Android configs — emulator loopback, not production
