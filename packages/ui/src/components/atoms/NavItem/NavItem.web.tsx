import { cn } from '#Lib/cn'

import { Icon } from '../Icon/Icon.web'
import { Typography } from '../Typography/Typography.web'

import { NAV_LABEL_VARIANT } from './NavItem.constants'
import { web } from './NavItem.styles'
import { navItemVariants } from './NavItem.variants'

import type { INavItemProps } from './NavItem'

/** Web implementation of the NavItem component. */
export function NavItem({
  icon,
  label,
  active = false,
  collapsed = false,
  orientation = 'row',
  onPress,
}: Readonly<INavItemProps>) {
  return (
    <div
      role="tab"
      aria-selected={!!active}
      aria-label={collapsed ? label : undefined}
      onClick={onPress}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPress?.()
        }
      }}
      tabIndex={0}
      className={cn(
        navItemVariants({ active, orientation, collapsed }),
        !active && web.hover,
        web.root,
        web.transition,
        web.cursor
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
          className="text-center"
        >
          {label}
        </Typography>
      )}
    </div>
  )
}
