# Supabase — Supprimer un compte utilisateur

## Via le dashboard

1. **Authentication** → **Users**
2. Chercher le mail
3. `...` → **Delete user**

> La suppression peut prendre quelques secondes à se propager.
> Les tables `public.*` (transactions, budgets, pots, preferences, balances) sont nettoyées par `ON DELETE CASCADE`.

## Via le seed script

Si le mail est configuré dans `.env` comme `SEED_EMAIL` / `SEED_PASSWORD` :

```bash
pnpm seed
```

Le script fait un CASCADE delete + re-create du compte.

## Via SQL (SQL Editor dans le dashboard)

### Vérifier si le user existe encore

```sql
SELECT id, email, deleted_at FROM auth.users WHERE email = 'user@example.com';
SELECT id, user_id, provider, identity_data->>'email' AS email
  FROM auth.identities WHERE identity_data->>'email' = 'user@example.com';
```

### Suppression complète (hard delete)

```sql
DELETE FROM auth.users WHERE email = 'user@example.com';
```

Cela cascade automatiquement vers `auth.identities`, `auth.sessions`, et toutes les tables `public.*` liées par FK.

### Chercher des traces orphelines

```sql
SELECT * FROM auth.users WHERE email ILIKE '%fragment%';
SELECT * FROM auth.identities WHERE identity_data->>'email' ILIKE '%fragment%';
```

## Gotcha : "email already registered" après suppression

Supabase peut mettre quelques secondes à propager la suppression. Si le problème persiste :

1. Vérifier que `auth.users` et `auth.identities` sont bien vides (requêtes ci-dessus)
2. Si vide partout → attendre ~30s, c'est un cache interne Supabase
3. En dernier recours, utiliser un autre mail pour tester
