# A10 — Server-Side Request Forgery (SSRF)

OWASP Top 10 #10. Application fetches remote resources without validating user-supplied URLs.

## Checklist

### Critical

#### OWASP-A10-001: Unvalidated URL in server-side fetch
- **Where**: API routes, any server-side `fetch()` or HTTP client calls
- **Check**: No user-provided URL passed directly to `fetch()`, `axios`, or similar
- **Check**: If URL needed from user, validate against strict allowlist
- **Check**: No ability to fetch `file://`, `gopher://`, or internal metadata endpoints

### High

#### OWASP-A10-002: Internal network access via user input
- **Where**: API routes that proxy or fetch external resources
- **Check**: Cannot reach `localhost`, `127.0.0.1`, `10.*`, `172.16-31.*`, `192.168.*` via user input
- **Check**: Cannot access cloud metadata endpoints (`169.254.169.254`)
- **Check**: DNS rebinding protection (resolve before fetching, validate IP)

#### OWASP-A10-003: Open redirect enabling SSRF chain
- **Where**: Redirect handling, OAuth callbacks
- **Check**: `redirectTo` / `redirect_uri` parameters validated against allowlist
- **Check**: No arbitrary URL in redirect target
- **Known**: SEC-006 (deferred — oauth.ts redirectTo not validated yet)

### Medium

#### OWASP-A10-004: Webhook or callback URL injection
- **Where**: Any webhook registration, notification URLs
- **Check**: Callback URLs validated before server sends requests to them
- **Check**: If webhooks used, URL scheme restricted to https
- **Note**: May not apply if no webhook feature exists

#### OWASP-A10-005: Image/avatar URL fetching
- **Where**: Avatar loading, any server-side image processing
- **Check**: If server fetches images from user-provided URLs, validate scheme + domain
- **Check**: Timeout and size limits on fetched resources
- **Note**: If avatar URLs are only used client-side (img src), SSRF doesn't apply — but verify

#### OWASP-A10-006: Import/export URL handling
- **Where**: Data import features, CSV/file URL loading
- **Check**: No server-side fetch of user-provided file URLs
- **Check**: Import via file upload (not URL fetch) is safer

### Low

#### OWASP-A10-007: DNS rebinding potential
- **Where**: Any URL validation logic
- **Check**: If validating URLs, resolve DNS BEFORE making request
- **Check**: Validate resolved IP is not internal/reserved
- **Note**: Advanced attack — low priority for this project

#### OWASP-A10-008: Supabase Storage URL manipulation
- **Where**: Supabase Storage URL construction
- **Check**: Storage bucket paths not user-controllable for arbitrary file access
- **Check**: Signed URL generation uses correct bucket/path validation

#### OWASP-A10-009: Third-party API proxy without validation
- **Where**: Any server route that proxies to external APIs
- **Check**: Target API host hardcoded, not from user input
- **Check**: Only expected paths/methods forwarded
- **Note**: Relevant if GoCardless integration proxies requests

#### OWASP-A10-010: Email/notification target injection
- **Where**: Email sending, push notification targets
- **Check**: Recipient addresses not controllable by arbitrary user input
- **Check**: No ability to send notifications to unintended recipients
- **Note**: Supabase Auth handles email — verify no custom email logic
