# Netlify Deploy — Attempts Log

## Context

Monorepo avec `apps/web` (React Router 7 SSR) et `apps/api` (Express 5).
CI build tout, puis les workflows deploy envoient sur Netlify via CLI.

---

## Problèmes rencontrés et fixes appliqués

### 1. Web — `path-to-regexp` v8 crash (FIXÉ)

**Erreur** : `TypeError: Missing parameter name at index 1: *`
**Cause** : Express 5 utilise `path-to-regexp@8.4.2` qui n'accepte plus `'*'` comme wildcard.
**Fix** : `apps/web/server/app.ts` — `'*'` → `'{*splat}'`

### 2. Web — SSR crash `createBrowserClient()` (FIXÉ)

**Erreur** : `Failed to fetch` côté serveur Node pendant le SSR.
**Cause** : `createBrowserClient()` de `@supabase/ssr` s'exécute au niveau module, même côté serveur SSR (pas de cookies/browser APIs).
**Fix** : `apps/web/app/lib/supabase.ts` — SSR guard `typeof document !== 'undefined'`

### 3. Web — Assets statiques 404 en prod locale (FIXÉ)

**Erreur** : Tous les JS/CSS retournent 404.
**Cause** : `express.static('build/client')` est relatif au CWD (racine monorepo), pas au fichier serveur.
**Fix** : `apps/web/server/app.ts` — Résolution via `__dirname` + `path.resolve`

### 4. Web — HTTPS check bloque prod locale (FIXÉ)

**Erreur** : `VITE_API_URL must be an HTTPS URL in production`
**Cause** : Le check `!import.meta.env.DEV` est `true` dans un build prod, même en local.
**Fix** : `apps/web/app/root.tsx` — Check uniquement si `VITE_API_URL` est explicitement défini.

### 5. API — CORS bloque web sur port 3000 (FIXÉ)

**Erreur** : `Failed to fetch` — pas de `Access-Control-Allow-Origin` dans la réponse.
**Cause** : `ALLOWED_ORIGINS=http://localhost:5173` dans `apps/api/.env` — n'incluait pas port 3000.
**Fix** : Ajout `http://localhost:3000` dans `apps/api/.env` + fallback dans `app.ts`.

### 6. API — Env vars manquantes sur Netlify (FIXÉ)

**Erreur** : `Internal Server Error` sur `epouch-api.netlify.app`
**Cause** : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ALLOWED_ORIGINS` pas configurées dans le dashboard Netlify.
**Fix** : Variables ajoutées dans Netlify → Site configuration → Environment variables.

### 7. Deploy — `--functions` path doublé avec `--cwd` (IDENTIFIÉ)

**Erreur** : `Functions folder "apps/web/apps/web/build/server" doesn't exist!`
**Cause** : `--dir` résout depuis le shell CWD, mais `--functions` résout depuis `--cwd`. Le chemin `apps/web/build/server` + `--cwd apps/web` = double préfixe.
**Tentatives** :
- `--functions=build/server` (relatif à `--cwd`) — non testé en CI avant changement de stratégie
- Migration vers `@netlify/vite-plugin-react-router` — en cours

### 8. Web — Migration vers @netlify/vite-plugin-react-router (EN COURS)

**Objectif** : Le plugin gère automatiquement la création de la fonction SSR Netlify.
**Ce qui a été fait** :
- Installé `@netlify/vite-plugin-react-router`
- Ajouté au `vite.config.ts`
- Le plugin génère `build/server/server.js` (handler Netlify)
- Notre Express custom reste dans `build/server/app.js` (prod locale)
- `netlify.toml` mis à jour avec `[functions] directory = "build/server"` et redirect vers `/.netlify/functions/server`
- Workflow simplifié : `netlify deploy --prod --no-build --site=$ID --cwd apps/web`

**Status** : Dernier push `6e162a8` — en attente de résultat deploy.

**Problème potentiel** : Avec `--no-build`, est-ce que le CLI lit `publish` et `[functions].directory` depuis `netlify.toml` correctement via `--cwd` ? Non vérifié.

---

## État actuel des fichiers deploy

### `.github/workflows/deploy-web.yml`
```
netlify deploy --prod --no-build --site=$NETLIFY_SITE_ID_WEB --cwd apps/web
```

### `.github/workflows/deploy-api.yml`
```
netlify deploy --prod --no-build --filter api-financial-app --dir=apps/api/public --functions=netlify/functions --site=$NETLIFY_SITE_ID_API --cwd apps/api
```

### `apps/web/netlify.toml`
```toml
[build]
  command = "react-router build"
  publish = "build/client"

[functions]
  directory = "build/server"
  node_bundler = "esbuild"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/server"
  status = 200
```

### `apps/api/netlify.toml`
```toml
[functions]
  node_bundler = "esbuild"
  included_files = ["dist/**"]

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
  force = true
```

---

## Prochaines étapes

1. **Vérifier le deploy en ligne** avant toute modif de code
2. **Ajouter Sentry** (web + API) pour avoir de la visibilité sur les erreurs en prod
3. **Open-source les packages** pour avoir accès au code source des dépendances
4. **Vérifier les logs Netlify Functions** dans le dashboard (pas juste le CLI)
5. Si le deploy `6e162a8` ne marche toujours pas, tester manuellement en CLI locale :
   ```
   cd apps/web && netlify deploy --prod --no-build --site=$SITE_ID
   ```
