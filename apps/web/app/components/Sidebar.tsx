import { Navigation } from '@financial-app/ui'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

import type { INavItemConfig } from '@financial-app/ui'

import { authClient } from '../lib/supabase'

const SIGN_OUT_HREF = '/sign-out'

const NAV_ITEMS: readonly INavItemConfig[] = [
  { icon: 'navOverview', label: '', href: '/' },
  { icon: 'navTransactions', label: '', href: '/transactions' },
  { icon: 'navBudgets', label: '', href: '/budgets' },
  { icon: 'navPots', label: '', href: '/pots' },
  { icon: 'navRecurringBills', label: '', href: '/recurring' },
  { icon: 'logout', label: '', href: SIGN_OUT_HREF },
] as const

const NAV_LABEL_KEYS = [
  'navigation.overview',
  'navigation.transactions',
  'navigation.budgets',
  'navigation.pots',
  'navigation.recurringBills',
  'auth.signOut',
] as const

/**
 * App-level navigation wrapper — bridges @financial-app/ui Navigation
 * with React Router navigation and i18n labels.
 * Sign-out is rendered as a nav item with intercepted click.
 */
export function Sidebar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const items: INavItemConfig[] = useMemo(
    () =>
      NAV_ITEMS.map((item, i) => ({
        ...item,
        label: t(NAV_LABEL_KEYS[i]),
      })),
    [t]
  )

  const handleNavigate = useCallback(
    (href: string) => {
      if (href === SIGN_OUT_HREF) {
        void authClient.signOut().then(() => {
          void navigate('/login', { replace: true })
        })
        return
      }
      void navigate(href)
    },
    [navigate]
  )

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  return (
    <Navigation
      items={items}
      activeHref={location.pathname}
      onNavigate={handleNavigate}
      collapsed={collapsed}
      onToggleCollapse={handleToggleCollapse}
      minimizeLabel={t('navigation.minimizeMenu')}
    />
  )
}
