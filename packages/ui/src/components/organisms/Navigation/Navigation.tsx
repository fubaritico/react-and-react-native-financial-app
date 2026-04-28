import type { IconName } from '@financial-app/icons'

/** A single navigation item configuration. */
export interface INavItemConfig {
  /** Icon name from @financial-app/icons. */
  icon: IconName
  /** i18n-resolved label text. */
  label: string
  /** Route path (e.g. '/', '/transactions'). */
  href: string
}

/** Props for the Navigation component. */
export interface INavigationProps {
  /** Ordered list of navigation items. */
  items: readonly INavItemConfig[]
  /** Currently active route path (matched against item href). */
  activeHref: string
  /** Callback fired when a navigation item is selected. */
  onNavigate: (href: string) => void
  /** Whether the sidebar is in collapsed (icons-only) mode. Desktop only. */
  collapsed?: boolean
  /** Callback to toggle collapsed state. Desktop only. */
  onToggleCollapse?: () => void
  /** Label for the minimize/expand toggle button. */
  minimizeLabel?: string
}
