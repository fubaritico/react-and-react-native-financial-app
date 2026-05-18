# A04 — Insecure Design

OWASP Top 10 #4. Missing or ineffective security controls at the design level.

## Checklist

### High

#### OWASP-A04-001: Missing rate limiting on auth endpoints
- **Where**: API auth-related routes, login/signup flows
- **Check**: Brute-force protection on authentication attempts
- **Check**: Rate limiting on OTP verification, TOTP challenges
- **Note**: May be handled by Supabase Auth (verify configuration)

#### OWASP-A04-002: Missing rate limiting on mutation endpoints
- **Where**: API POST/PUT/DELETE routes
- **Check**: No ability to spam create/update/delete operations
- **Check**: At minimum, application-level throttling or Supabase plan limits

#### OWASP-A04-003: Business logic bypass
- **Where**: API routes with financial operations (add money, withdraw, transfer)
- **Check**: Race conditions on balance checks (read-then-write without atomicity)
- **Check**: Negative amount bypass (can submit negative values to reverse operations?)
- **Check**: Integer overflow on financial amounts

#### OWASP-A04-004: Missing input bounds
- **Where**: API schemas, form validation
- **Check**: Numeric inputs have min/max bounds (amounts, quantities)
- **Check**: String inputs have max length limits
- **Check**: Array inputs have max size limits
- **Check**: File uploads (if any) have size + type limits

### Medium

#### OWASP-A04-005: Lack of anti-automation
- **Where**: Forms, public-facing endpoints
- **Check**: CAPTCHA or equivalent on public-facing operations (signup, contact)
- **Note**: For this project, Supabase Auth may handle this — verify

#### OWASP-A04-006: Predictable resource identifiers
- **Where**: API routes with ID parameters
- **Check**: IDs are UUIDs (not sequential integers) — harder to enumerate
- **Check**: No information leakage via ID format

#### OWASP-A04-007: Missing transaction isolation
- **Where**: Financial operations (add/withdraw money, budget allocation)
- **Check**: Read-then-write operations should be atomic or use optimistic locking
- **Check**: Concurrent requests cannot double-spend or create negative balances

#### OWASP-A04-008: Insufficient separation of environments
- **Where**: Config files, env variables
- **Check**: Dev/test credentials cannot accidentally reach production
- **Check**: Dev-only endpoints (`/dev/*`) gated behind `NODE_ENV` check

### Low

#### OWASP-A04-009: Missing account lockout
- **Where**: Auth flow
- **Check**: Supabase config includes max failed attempts before lockout
- **Note**: Informational — likely handled at Supabase level

#### OWASP-A04-010: No abuse monitoring
- **Where**: API, auth flows
- **Check**: Ability to detect unusual patterns (many failed logins, rapid operations)
- **Note**: Informational for this project stage
