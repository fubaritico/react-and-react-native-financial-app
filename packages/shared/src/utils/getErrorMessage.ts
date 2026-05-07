/** Network error messages thrown by fetch when the server is unreachable. */
const NETWORK_MESSAGES = ['failed to fetch', 'network request failed']

/**
 * Extracts a human-readable error message from any error shape.
 * Handles: network errors, Error instances, HeyAPI `{ error: "..." }` responses, and unknown types.
 * API errors are already prefixed by the server ([VALIDATION], [AUTH], [DATABASE], etc.).
 * Network errors (server unreachable) are prefixed client-side with [NETWORK].
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (NETWORK_MESSAGES.includes(error.message.toLowerCase())) {
      return `[NETWORK] ${error.message}`
    }
    return error.message
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as Record<string, unknown>).error === 'string'
  ) {
    return (error as Record<string, unknown>).error as string
  }
  return String(error)
}
