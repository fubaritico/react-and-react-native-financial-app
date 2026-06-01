import { useCallback } from 'react'

import { cn } from '#Lib/cn'

import { Icon } from '../Icon/Icon.web'
import { Typography } from '../Typography/Typography.web'

import { NAV_LABEL_VARIANT } from './NavItem.constants'
import { web } from './NavItem.styles'
import { navItemVariants } from './NavItem.variants'

import type { INavItemProps } from './NavItem'
import type { KeyboardEvent } from 'react'

/**
 * Web implementation of the NavItem component.
 * When `onPress` is provided, NavItem is standalone interactive (role="button").
 * When wrapped in `<a>` (Navigation), `onPress` is undefined — purely presentational.
 * @param props - Icon, label, active/collapsed state, orientation, and optional onPress
 * @returns The rendered nav item element
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
  /** Bottom-bar orientation (mobile/tablet) — mirrors the native tab bar styling */
  const isColumn = orientation === 'column'

  /**
   * Activates the item on Enter/Space when it is itself the interactive element.
   * @param e - Keyboard event from the focusable container
   * @returns void
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!onPress) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onPress()
      }
    },
    [onPress]
  )

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onPress : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      aria-current={isInteractive && active ? 'page' : undefined}
      aria-label={collapsed ? label : undefined}
      className={cn(
        navItemVariants({ active, orientation, collapsed }),
        web.root,
        web.transition,
        web.cursor,
        {
          [web.bottomBarShape]: isColumn,
          [web.activeRow]: active && !isColumn,
          [web.activeColumn]: active && isColumn,
          [web.hover]: !active,
          [web.bottomBarHover]: !active && isColumn,
          [web.focus]: isInteractive,
        }
      )}
    >
      <Icon
        name={icon}
        iconSize="lg"
        color={active ? (isColumn ? 'on-dark' : 'nav-accent') : 'currentColor'}
      />
      {!collapsed && (
        <Typography
          variant={NAV_LABEL_VARIANT[orientation ?? 'row'] ?? 'body-bold'}
          color={active ? (isColumn ? 'on-dark' : 'foreground') : 'inherit'}
          className={web.label}
        >
          {label}
        </Typography>
      )}
    </div>
  )
}
