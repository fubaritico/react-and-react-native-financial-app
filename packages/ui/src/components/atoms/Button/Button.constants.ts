import type { IconColor } from '../Icon/Icon.tsx'

/** Semantic icon color per button variant. */
export const ICON_COLOR_TOKEN: Record<string, IconColor> = {
  primary: 'primary-foreground',
  secondary: 'foreground',
  tertiary: 'muted',
  destroy: 'primary-foreground',
  outline: 'foreground',
}

/** Token name mapping for spinner color per button variant (resolved via resolveColor on native). */
export const SPINNER_COLOR_TOKEN: Record<string, string> = {
  primary: 'primary-foreground',
  secondary: 'foreground',
  tertiary: 'foreground-muted',
  destroy: 'primary-foreground',
  outline: 'foreground',
  ghost: 'foreground',
}
