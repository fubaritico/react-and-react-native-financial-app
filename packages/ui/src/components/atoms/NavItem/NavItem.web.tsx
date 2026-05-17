import { cn } from '#Lib/cn'

import { Icon } from '../Icon/Icon.web'
import { Typography } from '../Typography/Typography.web'

import { NAV_LABEL_VARIANT } from './NavItem.constants'
import { web } from './NavItem.styles'
import { navItemVariants } from './NavItem.variants'

import type { INavItemProps } from './NavItem'

/**
 * Web implementation of the NavItem component.
 * When `onPress` is provided, NavItem is standalone interactive (role="button").
 * When wrapped in `<a>` (Navigation), `onPress` is undefined — purely presentational.
 */
export function NavItem({
  icon,
  label,
  active = false,
  collapsed = false,
  orientation = 'row',
  onPress,
}: Readonly<INavItemProps>) {
  const isInteractive = !!onPress

  const handleKeyDown = isInteractive
    ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPress()
        }
      }
    : undefined

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onPress : undefined}
      onKeyDown={handleKeyDown}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? label : undefined}
      className={cn(
        navItemVariants({ active, orientation, collapsed }),
        !active && web.hover,
        web.root,
        web.transition,
        web.cursor,
        isInteractive && web.focus
      )}
    >
      <Icon
        name={icon}
        iconSize="lg"
        color={active ? 'var(--color-nav-accent)' : 'currentColor'}
      />
      {!collapsed && (
        <Typography
          variant={NAV_LABEL_VARIANT[orientation ?? 'row'] ?? 'body-bold'}
          color={active ? 'foreground' : 'inherit'}
          className={web.label}
        >
          {label}
        </Typography>
      )}
    </div>
  )
}
