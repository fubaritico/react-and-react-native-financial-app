/**
 * Max transactions fetched per request — large enough to render full lists
 * client-side until server-side pagination lands (CLAUDE.md → "Server-side pagination").
 */
export const TRANSACTION_FETCH_LIMIT = 1000
