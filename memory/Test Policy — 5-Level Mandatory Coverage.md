---
title: Test Policy — 5-Level Mandatory Coverage
type: note
permalink: financial-app/test-policy-5-level-mandatory-coverage
tags:
- testing
- workflow
- rules
---

# Test Policy — 5-Level Mandatory Coverage

## Overview
Every new feature, component, hook, route, utility, or bug fix MUST ship with tests covering 5 levels. No code is considered done without tests, a `/commit`, and `/end-session`.

## Observations

- [rule] Every test suite MUST cover 5 levels: happy path, variant cases, managed errors, unmanaged errors, edge cases
- [rule] No level can be skipped — if genuinely N/A, document with comment `// L4: N/A — reason`
- [rule] Mandatory completion sequence: tests → type-check/lint/test → /review → /commit → /end-session
- [level-1] Happy path — nominal use case with valid inputs (renders, callbacks fire, API returns 200)
- [level-2] Variant cases — all meaningful prop/param combinations, conditional branches, each variant/size/state
- [level-3] Managed error cases — errors the code explicitly handles (validation 400, not found 404, conflict 409, disabled states)
- [level-4] Unmanaged error cases — unexpected failures (500, network timeout, malformed data, null responses)
- [level-5] Edge cases — boundaries, empty arrays, max-length strings, zero/negative amounts, unicode, rapid mount/unmount, concurrent mutations
- [convention] Test describe blocks follow: `describe('happy path')`, `describe('variants')`, `describe('managed errors')`, `describe('unmanaged errors')`, `describe('edge cases')`
- [scope] UI components: render, variants, disabled/loading, missing optional props, a11y attributes
- [scope] Feature components: mock props render, all prop combos, empty/loading/error states, callback arguments
- [scope] Hooks: expected shape, input combos, error handling, cleanup on unmount
- [scope] API routes: CRUD success, query params, validation 400, not found 404, conflict 409, supabase 500, auth 401, boundary values
- [scope] CRUD hooks: create/update/delete + invalidation, edit mode pre-fill, server errors, concurrent ops
- [pragmatic] Not every level produces equal test count — edge cases may have 1-2, variants may have 10
- [pragmatic] Prioritize test quality over quantity — each test asserts one meaningful behavior

## Relations

- documents [[Testing Architecture Decisions]]
- enforced_by [[Post-Code Mandatory Sequence]]
- referenced_in `.claude/rules/tests.md`
- referenced_in `.claude/rules/design-system.md`
- referenced_in `.claude/rules/api.md`
- referenced_in `.claude/rules/features.md`
- referenced_in `.claude/skills/new-component/SKILL.md`
- referenced_in `.claude/CLAUDE.md`
