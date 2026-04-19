# Supabase Evaluation (April 2026)

## Decision

**Keep Supabase** as the backend platform. Plan for Pro tier ($25/mo) in production.

## Why Supabase

- PostgreSQL — relational, ACID, ideal for financial data (transactions, budgets, relationships)
- Auth + Storage + Realtime bundled — no need to assemble 3-4 separate services
- Open-source — self-hostable if costs grow (unlike Firebase)
- Official Expo/React Native support (first-class docs)
- Express API gateway (Phase 7) controls data flow, mitigates egress concerns

## Free Tier Limitations

| Limit | Value | Impact |
|-------|-------|--------|
| Database size | 500 MB (includes WAL overhead) | Fine for dev, not production |
| Egress | 5 GB/month | ~500 DAU x 20 calls x 50KB = gone in 10 days |
| Projects | 2 max | One prod, one staging |
| Inactivity pause | 7 days | Unsuitable for always-on production |
| MAU (auth) | 50,000 | Sufficient for most apps |
| Edge function cold starts | 200-500ms | Noticeable on first request after idle |
| Connections | 200 concurrent | Can bottleneck under load |

Storage overhead: deleting files via SQL only removes metadata, not S3 data.
Upgrade recommended when DB approaches 400-450 MB.

## Pro Plan ($25/mo)

- 8 GB database, 100K MAUs, 100 GB storage
- Daily backups, no project pausing
- Most small-to-medium apps land at $35-75/mo with usage fees

## Alternatives Considered

| | Supabase | Firebase | Neon | PlanetScale |
|---|---|---|---|---|
| DB type | PostgreSQL | NoSQL (Firestore) | PostgreSQL | MySQL (Vitess) |
| Auth built-in | Yes | Yes | No | No |
| Storage built-in | Yes | Yes | No | No |
| Realtime | Yes | Yes | No | No |
| Offline sync | Limited | Excellent | No | No |
| Open-source | Yes | No | Yes | Partial |
| Free tier | Yes (pauses) | Yes (generous) | Yes | Removed |
| Starting paid | $25/mo | Pay-per-use | $19/mo | $39/mo |

### Why not Firebase

- NoSQL is a poor fit for financial data
- Vendor lock-in (Google proprietary)
- Costs escalate unpredictably at scale

### Why not Neon / PlanetScale

- Database-only — need to add auth, storage, realtime separately
- PlanetScale removed free tier, MySQL only, no foreign keys at DB level
- Neon cold starts on lower plans ($69/mo for always-on)

## Gap to Address

**Offline support for financial data** — solve at app level:
- TanStack Query persistence
- Local SQLite cache (expo-sqlite)
- Not expected from the backend

## Agent Skills

Installed from `supabase/agent-skills` (official):

| Skill | Installs | Purpose |
|-------|----------|---------|
| `supabase` | 24.5K | General Supabase platform usage |
| `supabase-postgres-best-practices` | 107K | Postgres optimization, RLS, queries |

Install commands:
```bash
npx skills add supabase/agent-skills@supabase -g -y
npx skills add supabase/agent-skills@supabase-postgres-best-practices -g -y
```

## Sources

- [Supabase Pricing 2026: Complete Breakdown](https://www.metacto.com/blogs/the-true-cost-of-supabase-a-comprehensive-guide-to-pricing-integration-and-maintenance)
- [Supabase Pricing: Real Costs at 10K-100K Users](https://designrevision.com/blog/supabase-pricing)
- [Neon vs Supabase vs PlanetScale Comparison](https://dev.to/whoffagents/neon-vs-supabase-vs-planetscale-managed-postgres-for-nextjs-in-2026-2el4)
- [Firebase vs Supabase 2026 Comparison](https://designrevision.com/blog/supabase-vs-firebase)
- [Making the Most of Supabase's Free Tier](https://medium.com/@reliabledataengineering/making-the-most-of-supabases-free-tier-a-practical-guide-ef4817d84a26)
- [Expo — Using Supabase Guide](https://docs.expo.dev/guides/using-supabase/)
