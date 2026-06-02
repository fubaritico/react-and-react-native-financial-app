---
title: Fix — Fly API ECONNRESET = trial ended (not a code bug)
type: fix
permalink: financial-app/fixes/fix-fly-api-econnreset-trial-ended-not-a-code-bug
tags:
- fly
- deployment
- debugging
- incident
---

# Fix — Fly API ECONNRESET = trial ended (not a code bug)

## Symptom

- Web app: "Échec du chargement des données. Veuillez réessayer." on every screen, after login.
- Netlify SSR loader logged: `TypeError: fetch failed` → `[cause] Error: Client network socket disconnected before secure TLS connection was established`, `code: 'ECONNRESET'`, `host: 'epouch-api.fly.dev'`, `port: 443` → `[500]`.
- `auth=...ms` in the same log was fine — auth was NOT the problem.

## Root cause

The **Fly.io free trial expired** → the `epouch-api` machine was suspended → every request (SSR loader **and** client-side useQuery) to `epouch-api.fly.dev` failed at the TLS handshake. `fly status -a epouch-api` returned: `trial has ended, please add a credit card`.

## Fix

Add a payment method on Fly (https://fly.io/trial) → app restarts. While there, reduced RAM `1gb → 512mb` in `fly.toml` (~$3.63/mo, Fly calculator). See [[infra-hosting-regions]].

## Lesson (reflex)

When **all** API calls fail with `ECONNRESET` / TLS-disconnect to the Fly host — and `auth`/local logic looks fine — **check Fly billing + `fly status` FIRST**. Do NOT assume a code/auth regression. This wasted a long debugging detour chasing a phantom "auth lost on client navigation" theory (it was the API being offline the whole time).

- [decision] getClaims + skip-server-hop were sane throughout; the breakage was purely infra.
- Related: [[ssr-query-refactoring-unified-hey-api-client]]
