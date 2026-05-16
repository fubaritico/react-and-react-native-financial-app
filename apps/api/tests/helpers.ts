/** Test user UUID — matches mock auth handler response. */
export const TEST_USER_ID = 'd8e4f26e-dc4f-41a7-8e66-1b1805a00b41'

/** Test user email. */
export const TEST_USER_EMAIL = 'test@example.com'

/** Supabase project URL used in tests (must match env vars set in setup.ts). */
export const SUPABASE_URL = 'https://test-project.supabase.co'

/** Fake bearer token — MSW auth handler accepts any token. */
export const AUTH_HEADER = { Authorization: 'Bearer fake-test-token' }
