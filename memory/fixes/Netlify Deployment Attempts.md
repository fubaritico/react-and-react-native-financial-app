---
title: Netlify Deployment Attempts
type: note
permalink: financial-app/fixes/netlify-deployment-attempts
tags:
- netlify
- deployment
- ci
- express
- ssr
---

# Netlify Deployment Attempts

## Context
Monorepo with `apps/web` (React Router 7 SSR) and `apps/api` (Express 5). CI builds, then deploy workflows push to Netlify via CLI.

## Fixes Applied (local prod working)

- [fix] Express 5 / path-to-regexp v8: bare `'*'` → `'{*splat}'` in `apps/web/server/app.ts`
- [fix] SSR crash: `createBrowserClient()` guarded with `typeof document !== 'undefined'` in `apps/web/app/lib/supabase.ts`
- [fix] Static assets 404: `express.static` resolved via `__dirname` + `path.resolve` instead of relative CWD
- [fix] HTTPS check: only enforce when `VITE_API_URL` explicitly set — allows local prod testing
- [fix] CORS: added `http://localhost:3000` to `apps/api/.env` `ALLOWED_ORIGINS`
- [fix] Netlify env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ALLOWED_ORIGINS` configured in dashboard

## Plugin Migration

- [decision] Migrated from custom `serverless-http` wrapper to `@netlify/vite-plugin-react-router`
- [architecture] Plugin generates `build/server/server.js` (Netlify handler) alongside custom `build/server/app.js` (Express for local prod)
- [config] `netlify.toml`: `[functions] directory = "build/server"` + redirect `/* → /.netlify/functions/server`
- [config] Deploy command: `netlify deploy --prod --no-build --site=$ID --cwd apps/web`

## Still Broken (online deploy)
## Resolved

- [resolved] Deploy fully working — both web and API sites live on Netlify
- [resolved] `@netlify/vite-plugin-react-router` handles web SSR
- [resolved] `serverless-http@4.0.0` handles API Lambda (Express 5 compat)

## Methodology for Next Session
## Lessons Learned

- [lesson] Check Netlify dashboard Function logs BEFORE any code change
- [lesson] Read package source code when docs are insufficient
- [lesson] Verify online state before making changes — stop blind iteration
- [doc] Full attempt log: `docs/deploy-netlify-attempts.md`

## Relations

- relates to [[API Architecture]]
- relates to [[Known Issues Registry]]
