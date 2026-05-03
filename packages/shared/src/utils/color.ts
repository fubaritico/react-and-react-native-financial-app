import { tokens } from '@financial-app/tokens/map'

/**
 * Resolves a token color name (e.g. "green", "cyan") to its hex value.
 * Uses the token pipeline as the single source of truth.
 * Falls back to the input string if not found (allows passing raw hex).
 * @param tokenName - Token color name or raw hex string
 * @returns Hex color value (e.g. "#277c78")
 */
export function resolveTokenColor(tokenName: string): string {
  const value = (tokens.color as Record<string, unknown>)[tokenName]
  return typeof value === 'string' ? value : tokenName
}
