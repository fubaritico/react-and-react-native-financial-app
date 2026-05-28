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

## serverless-http — Version critique

**`serverless-http` doit être en v4+** pour fonctionner avec Express 5.

v3 créait un stub socket avec `readable: false` — Express 5 (`raw-body`) vérifie que le stream
est lisible avant de le consommer. Avec le stub, `express.json()` skip la lecture → `req.body`
reste `undefined` → les POST/PUT/PATCH échouent (Zod "Required" sur tous les champs).

v4 utilise un vrai `PassThrough` stream — Express 5 peut lire le body normalement.

## Sentry — Configuration

Utiliser `@sentry/node` (pas `@sentry/aws-serverless`) :
- `Sentry.init()` dans `createApp()` (app.ts)
- `Sentry.setupExpressErrorHandler(app)` capture les erreurs de routes
- `Sentry.flush(2000)` dans le handler Lambda avant le return

## Environment Variables

| Variable | Où | Quand |
|----------|-----|-------|
| `VITE_*` (web) | GitHub Secrets | Build-time — inliné par Vite |
| `SUPABASE_URL`, `SENTRY_DSN`, etc. (API) | Netlify dashboard | Runtime — `process.env` dans Lambda |
| `SENTRY_AUTH_TOKEN` | GitHub Secrets | Build-time — upload source maps Sentry |

- Les vars `VITE_*` sont remplacées à la compilation, elles n'existent pas au runtime
- Les vars API sont lues au runtime par Lambda — elles doivent être dans le dashboard Netlify
- `SENTRY_AUTH_TOKEN` sert uniquement au plugin Vite pour uploader les source maps pendant le build

## Deployed Sites

| App | URL |
|-----|-----|
| Web | https://epouch-web.netlify.app |
| API | https://epouch-api.netlify.app |
