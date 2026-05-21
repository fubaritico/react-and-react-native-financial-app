/** Default distance (px) between the target element and the tooltip bubble. */
export const DEFAULT_OFFSET = 10

/** Width of the arrow triangle (px). */
export const ARROW_SIZE = 6

/** Platform-specific color values for the arrow. */
interface IArrowColors {
  /** CSS variable reference for web. */
  web: string
  /** twrnc color token for native. */
  native: string
}

/** Arrow border color per variant — maps to the bubble background for visual continuity. */
export const ARROW_COLOR_MAP: Record<'dark' | 'light', IArrowColors> = {
  dark: {
    web: 'var(--color-grey-900)',
    native: 'grey-900',
  },
  light: {
    web: 'var(--color-white)',
    native: 'white',
  },
}

/**
 * Get the arrow color for a given variant and platform.
 *
 * @param variant - tooltip variant name (defaults to 'dark')
 * @param platform - 'web' or 'native'
 * @returns the color string for the given platform
 */
export function getArrowColor(
  variant: string | null | undefined,
  platform: 'web' | 'native'
): string {
  const key = variant === 'light' ? 'light' : 'dark'
  return ARROW_COLOR_MAP[key][platform]
}
