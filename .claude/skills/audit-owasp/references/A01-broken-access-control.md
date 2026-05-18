# A01 — Broken Access Control

OWASP Top 10 #1. Failures in enforcing that users cannot act outside their intended permissions.

## Checklist

### Critical

#### OWASP-A01-001: Missing authentication on data route
- **Where**: API route files (`apps/api/src/routes/*.ts`)
- **Check**: Every router MUST call `router.use(requireAuth)` — no data endpoint unprotected
- **Exception**: `/health` (mounted on `app` directly, not a router)

#### OWASP-A01-002: Missing user_id filter on database query
- **Where**: API route handlers
- **Check**: Every `.from()` query MUST include `.eq('user_id', res.locals.userId)`
- **Check**: Every `.rpc()` call MUST pass `p_user_id: res.locals.userId`
- **Why**: Service role key bypasses RLS — this is the ONLY access control

#### OWASP-A01-003: Insecure Direct Object Reference (IDOR)
- **Where**: API routes with `:id` params
- **Check**: After fetching by ID, verify the record belongs to the authenticated user
- **Check**: Never trust client-provided `user_id` in request body for ownership

### High

#### OWASP-A01-004: Privilege escalation via body manipulation
- **Where**: API POST/PUT handlers
- **Check**: `user_id` must come from `res.locals.userId`, never from `req.body`
- **Check**: Zod schemas for input must NOT include `user_id` field

#### OWASP-A01-005: Missing authorization on destructive operations
- **Where**: DELETE endpoints
- **Check**: Record ownership verified before deletion (select + check user_id, or filter in WHERE)

#### OWASP-A01-006: Client-side route protection without server validation
- **Where**: Web loaders, mobile navigation guards
- **Check**: Client-side auth checks are supplementary — server MUST reject unauthorized requests independently
- **Check**: Sensitive data never loaded in client bundle before auth check

### Medium

#### OWASP-A01-007: Horizontal privilege escalation via query params
- **Where**: API GET endpoints with filters
- **Check**: Query params like `?user_id=X` cannot override `res.locals.userId`

#### OWASP-A01-008: Missing access control on file/asset URLs
- **Where**: Any URL construction for user assets (avatars, documents)
- **Check**: Supabase Storage URLs must use signed URLs or RLS-protected buckets

#### OWASP-A01-009: Metadata manipulation
- **Where**: API routes that accept `created_at`, `updated_at`, or system fields
- **Check**: System fields must be server-set, never accepted from client input

### Low

#### OWASP-A01-010: Verbose error revealing access control logic
- **Where**: API error responses
- **Check**: 404 (not found) should be returned instead of 403 (forbidden) to avoid confirming resource existence
