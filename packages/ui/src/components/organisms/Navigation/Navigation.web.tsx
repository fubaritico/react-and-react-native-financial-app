import { cn } from '#Lib/cn'

import { Icon } from '../../atoms/Icon/Icon.web'
import { NavItem } from '../../atoms/NavItem/NavItem.web'
import { Typography } from '../../atoms/Typography/Typography.web'

import { shared, web } from './Navigation.styles'

import type { INavigationProps } from './Navigation'

/** Web implementation of the Navigation component — sidebar (desktop) + bottom bar (mobile/tablet). */
export function Navigation({
  items,
  activeHref,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  minimizeLabel = 'Minimize Menu',
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
            name={collapsed ? 'logoSmall' : 'logoLarge'}
            color="currentColor"
            className={cn('text-on-dark', { 'ml-8': !collapsed })}
          />
        </div>

        {/* Nav items */}
        <nav
          className={shared.navList}
          role="tablist"
          aria-orientation="vertical"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault()
                onNavigate(item.href)
              }}
              className={web.navLink}
              tabIndex={-1}
            >
              <NavItem
                icon={item.icon}
                label={item.label}
                active={activeHref === item.href}
                collapsed={collapsed}
                orientation="row"
              />
            </a>
          ))}
        </nav>

        {/* Minimize toggle */}
        {onToggleCollapse && (
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
      <nav
        className={web.bottomBar}
        role="tablist"
        aria-orientation="horizontal"
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(item.href)
            }}
            className={web.bottomBarItem}
            tabIndex={-1}
          >
            <NavItem
              icon={item.icon}
              label={item.label}
              active={activeHref === item.href}
              orientation="column"
            />
          </a>
        ))}
      </nav>
    </>
  )
}
