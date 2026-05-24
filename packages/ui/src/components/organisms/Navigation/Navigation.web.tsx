import { useCallback } from 'react'

import { cn } from '#Lib/cn'

import { Icon } from '../../atoms/Icon/Icon.web'
import { NavItem } from '../../atoms/NavItem/NavItem.web'
import { Typography } from '../../atoms/Typography/Typography.web'

import { shared, web } from './Navigation.styles'

import type { INavItemConfig, INavigationProps } from './Navigation'

/** Single nav link — avoids inline arrows in the parent map. */
function NavLink({
  item,
  active,
  collapsed,
  orientation,
  onNavigate,
}: Readonly<{
  item: INavItemConfig
  active: boolean
  collapsed?: boolean
  orientation: 'row' | 'column'
  onNavigate: (href: string) => void
}>) {
  const safeHref = item.href.startsWith('/') ? item.href : '#'

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (item.href.startsWith('/')) onNavigate(item.href)
    },
    [item.href, onNavigate]
  )

  return (
    <a
      href={safeHref}
      onClick={handleClick}
      aria-label={item.label}
      className={orientation === 'row' ? web.navLink : web.bottomBarItem}
    >
      <NavItem
        icon={item.icon}
        label={item.label}
        active={active}
        collapsed={collapsed}
        orientation={orientation}
      />
    </a>
  )
}

/** Web implementation of the Navigation component — sidebar (desktop) + bottom bar (mobile/tablet). */
export function Navigation({
  items,
  activeHref,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  minimizeLabel,
}: Readonly<INavigationProps>) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          web.sidebar,
          collapsed ? web.sidebarCollapsed : web.sidebarExpanded
        )}
      >
        {/* Logo */}
        <div className={collapsed ? web.logoWrapCollapsed : web.logoWrap}>
          <Icon
            name="logoEpouch"
            color="currentColor"
            iconSize="4xl"
            className={cn('text-on-dark', { 'ml-8 mr-2': !collapsed })}
          />
          {!collapsed && (
            <Typography variant="heading-md" as="h1" color="on-dark">
              ePouch
            </Typography>
          )}
        </div>

        {/* Nav items */}
        <nav className={shared.navList} aria-label="Main">
          {items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={activeHref === item.href}
              collapsed={collapsed}
              orientation="row"
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        {/* Minimize toggle */}
        {onToggleCollapse && minimizeLabel && (
          <div className={web.minimizeWrap}>
            <button
              onClick={onToggleCollapse}
              aria-label={minimizeLabel}
              className={cn(web.minimizeButton, web.focusRing)}
            >
              <span className={collapsed ? web.minimizeIconRotated : undefined}>
                <Icon name="minimizeMenu" iconSize="lg" color="currentColor" />
              </span>
              {!collapsed && (
                <Typography variant="body-bold" as="span" color="inherit">
                  {minimizeLabel}
                </Typography>
              )}
            </button>
          </div>
        )}
      </aside>

      {/* Mobile / tablet bottom bar */}
      <nav className={web.bottomBar} aria-label="Main">
        {items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={activeHref === item.href}
            orientation="column"
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </>
  )
}
