# Rules — Netlify Deployment

## Request Flow

```
Browser → API Gateway (Netlify CDN) → Lambda event → serverless-http → Express app
```

- API Gateway convertit la requête HTTP en objet `event` Lambda (body string, headers, method, path)
- `serverless-http` reconstruit un faux `req`/`res` Node.js depuis l'event — Express tourne normalement
- Sentry flush les events avant que Lambda gèle le process

## Lambda Function (`apps/api/netlify/functions/api.ts`)

- Importe `createApp()` depuis `../../dist/app.js` — l'API doit être buildée (`tsc`) avant deploy
- `serverless-http` wrappe l'app Express pour Lambda
- `Sentry.flush(2000)` après chaque réponse pour garantir l'envoi des events Sentry

## Sentry — Règle critique

**NEVER use `@sentry/aws-serverless` `wrapHandler`** avec `serverless-http`.

`wrapHandler` consomme/modifie le body de l'event Lambda avant que `serverless-http` ne le reçoive.
Résultat : `req.body` est `undefined` dans Express → les POST/PUT/PATCH échouent (Zod "Required").

Utiliser `@sentry/node` avec `Sentry.flush()` manuel :
- `Sentry.init()` dans `createApp()` (app.ts)
- `Sentry.setupExpressErrorHandler(app)` capture les erreurs de routes
- `Sentry.flush(2000)` dans le handler Lambda avant le return

Les GET fonctionnent avec `wrapHandler` car ils n'ont pas de body — le bug ne touche que POST/PUT/PATCH.

## Environment Variables

| Variable | Où | Quand |
|----------|-----|-------|
| `VITE_*` (web) | GitHub Secrets | Build-time — inliné par Vite |
| `SUPABASE_URL`, `SENTRY_DSN`, etc. (API) | Netlify dashboard | Runtime — `process.env` dans Lambda |
| `SENTRY_AUTH_TOKEN` | GitHub Secrets | Build-time — upload source maps Sentry |

- Les vars `VITE_*` sont remplacées à la compilation, elles n'existent pas au runtime
- Les vars API sont lues au runtime par Lambda — elles doivent être dans le dashboard Netlify
- `SENTRY_AUTH_TOKEN` sert uniquement au plugin Vite pour uploader les source maps pendant le build
