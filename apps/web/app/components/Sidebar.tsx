import { Navigation } from '@financial-app/ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

import type { INavItemConfig } from '@financial-app/ui'

const NAV_ITEMS: readonly INavItemConfig[] = [
  { icon: 'navOverview', label: '', href: '/' },
  { icon: 'navTransactions', label: '', href: '/transactions' },
  { icon: 'navBudgets', label: '', href: '/budgets' },
  { icon: 'navPots', label: '', href: '/pots' },
  { icon: 'navRecurringBills', label: '', href: '/recurring' },
] as const

const NAV_LABEL_KEYS = [
  'navigation.overview',
  'navigation.transactions',
  'navigation.budgets',
  'navigation.pots',
  'navigation.recurringBills',
] as const

/**
 * App-level navigation wrapper — bridges @financial-app/ui Navigation
 * with React Router navigation and i18n labels.
 */
export function Sidebar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const items: INavItemConfig[] = NAV_ITEMS.map((item, i) => ({
    ...item,
    label: t(NAV_LABEL_KEYS[i]),
  }))

  /**
   * Toggles the collapsed state of a component or section.
   *
   * This function updates the state by switching the `collapsed` value
   * between `true` and `false`. It is typically used to handle UI behavior
   * where a section or component expands or collapses.
   */
  const handleOnToggleCollapse = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <Navigation
      items={items}
      activeHref={location.pathname}
      onNavigate={(href) => void navigate(href)}
      collapsed={collapsed}
      onToggleCollapse={handleOnToggleCollapse}
      minimizeLabel={t('navigation.minimizeMenu')}
    />
  )
}
