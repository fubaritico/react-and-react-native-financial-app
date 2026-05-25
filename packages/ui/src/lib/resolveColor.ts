import tw from './tw'

/**
 * Resolves a Tailwind color token to a hex string.
 * Throws if the token does not exist in the theme — a missing token
 * is a configuration bug, not a runtime condition to handle silently.
 *
 * @param token - Tailwind color token name (e.g. 'foreground', 'on-dark', 'grey-300')
 * @returns Resolved hex color string
 */
export function resolveColor(token: string): string {
  const color = tw.color(token)
  if (!color) {
    throw new Error(
      `[resolveColor] Unknown color token "${token}". Check your Tailwind config.`
    )
  }
  return color
}
