---
title: Prisma Type Generation
type: note
permalink: prisma-type-generation
tags: [architecture, prisma, types, database]
---

# Prisma Type Generation

## Observations

- [decision] Prisma is used ONLY for type generation — zero ORM runtime, zero query execution
- [how] `prisma db pull` introspects Supabase Postgres DB and generates `schema.prisma`
- [how] `prisma generate` produces TypeScript model interfaces from the schema
- [how] Types imported as `type` only in supabase layer — no runtime dependency on Prisma
- [package] `@financial-app/prisma` at `packages/prisma/` — exports model types
- [workflow] After DB schema changes: `cd packages/prisma && pnpm db:sync` (= db pull + generate)
- [gitignore] `src/generated/` is gitignored — CI/dev must run `pnpm db:sync` after clone
- [schema] Covers `public` + `auth` schemas (multi-schema introspection)
- [gotcha] `@prisma/studio-core` transitive dep pulls react-dom@19.2.5 — doesn't affect app tests but triggers pnpm singleton issues
- [gotcha] RPC return types can't be introspected by Prisma — defined manually in supabase layer

## Relations

- consumed_by [[Supabase Layer Pattern]]
- consumed_by [[API Architecture]]
- causes [[pnpm Singleton Debugging]]
- alternative_to [[Why Supabase SDK Over Prisma ORM]]
