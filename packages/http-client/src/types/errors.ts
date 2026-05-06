/**
 * Financial App API Error Response
 *
 * This is the error format returned by the API when a request fails.
 * All error responses follow this consistent shape.
 *
 * @example
 * // 401 Unauthorized
 * { error: "Missing authorization token" }
 *
 * @example
 * // 400 Bad Request (validation)
 * { error: "Invalid input" }
 *
 * @example
 * // 404 Not Found
 * { error: "Not found" }
 */
export interface IApiError {
  /** Human-readable error message */
  error: string
}
