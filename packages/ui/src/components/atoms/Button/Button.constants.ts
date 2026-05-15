/** Token name mapping for icon fill per button variant (resolved via tw.color on native). */
export const ICON_COLOR_TOKEN: Record<string, string> = {
  primary: 'primary-foreground',
  secondary: 'foreground',
  tertiary: 'foreground-muted',
  destroy: 'destructive-foreground',
  outline: 'foreground',
}

/** Token name mapping for spinner color per button variant (same tokens as text/icon). */
export const SPINNER_COLOR_TOKEN: Record<string, string> = {
  primary: 'primary-foreground',
  secondary: 'foreground',
  tertiary: 'foreground-muted',
  destroy: 'destructive-foreground',
  outline: 'foreground',
  ghost: 'foreground',
}
