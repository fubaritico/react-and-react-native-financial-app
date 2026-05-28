---
title: fix-lambda-post-body-parsing
type: note
permalink: financial-app/fixes/fix-lambda-post-body-parsing
tags:
- lambda
- serverless
- express
- body-parsing
- netlify
- serverless-http
---


# Fix — Lambda POST Body Parsing (serverless-http v3 + Express 5)

## Le problème

Les requêtes POST vers l'API déployée sur Netlify Functions (Lambda) échouent avec des erreurs Zod "Required" sur tous les champs — alors que le body JSON est bien présent dans l'event Lambda.

## Cause racine

`serverless-http@3.2.0` crée un stub socket avec `readable: false` dans `lib/request.js` :

```js
// v3.2.0 — CASSÉ avec Express 5
super({
  encrypted: true,
  readable: false,  // ← Express 5 voit "pas lisible" et skip le body
  // ...
});
```

Express 4 tolérait ce stub. Express 5 (via `raw-body`) vérifie que le stream est lisible avant de le consommer. Avec `readable: false`, `express.json()` ne lit jamais le stream → `req.body` reste `undefined`.

## Le fix

Upgrade `serverless-http` de `^3.2.0` à `^4.0.0`. La v4 utilise un vrai `PassThrough` stream :

```js
// v4.0.0 — FONCTIONNE avec Express 5
const socket = new PassThrough();
socket.encrypted = true;
socket.remoteAddress = remoteAddress;
socket.address = () => ({ port: 443 });
super(socket);
```

## Fausse piste : `@sentry/aws-serverless` `wrapHandler`

La première hypothèse était que `wrapHandler` de `@sentry/aws-serverless` consommait le body avant `serverless-http`. C'était FAUX — retirer `wrapHandler` n'a pas corrigé le problème. Le body était intact dans l'event, c'est la reconstruction du stream par `serverless-http` v3 qui échouait.

`wrapHandler` a été retiré pour d'autres raisons (simplification), mais ce n'était pas la cause du bug.

## Sentry — configuration correcte pour Express sur Lambda

- `@sentry/node` (pas `@sentry/aws-serverless`)
- `Sentry.init()` dans `createApp()` (app.ts)
- `Sentry.setupExpressErrorHandler(app)` capture les erreurs de routes
- `Sentry.flush(2000)` dans le handler Lambda avant le return (sinon Lambda gèle le process et les events Sentry en attente sont perdus)

## Leçon

Quand quelque chose échoue entre deux bibliothèques, **chercher sur le web d'abord** — GitHub issues, changelogs, compatibility notes. La réponse était dans le changelog de `serverless-http@4.0.0` : "uses a PassThrough stream internally instead of a stub". Un adapter non testé avec la dernière version majeure du framework qu'il wrappe = pattern classique d'incompatibilité.
