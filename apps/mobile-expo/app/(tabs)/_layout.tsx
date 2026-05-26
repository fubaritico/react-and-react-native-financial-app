import { NavItem } from '@financial-app/ui'
import { Tabs } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View, useWindowDimensions } from 'react-native'

import type { IconName } from '@financial-app/icons'

import tw from '../../src/lib/tw'

/**
 * Last visited content tab (non-settings) — updated by screenListeners.
 * Read by settings.tsx to navigate back after save/cancel.
 *
 * Module-level mutable — React Navigation tab history doesn't reliably
 * track intermediate tab visits, so we track manually via `focus` events.
 */
export let lastContentTab = 'index'

/**
 * Updates the last visited content tab reference.
 * Called from the `focus` screen listener — skips the settings tab.
 * @param name - The route name that received focus
 */
function trackContentTab(name: string): void {
  if (name !== 'settings' && name !== 'categories') {
    lastContentTab = name
  }
}

/** Tab config per screen name */
const TAB_CONFIG: Partial<
  Record<string, { icon: IconName; labelKey: string }>
> = {
  index: { icon: 'navOverview', labelKey: 'navigation.overview' },
  transactions: {
    icon: 'navTransactions',
    labelKey: 'navigation.transactions',
  },
  budgets: { icon: 'navBudgets', labelKey: 'navigation.budgets' },
  pots: { icon: 'navPots', labelKey: 'navigation.pots' },
  recurring: {
    icon: 'navRecurringBills',
    labelKey: 'navigation.recurringBills',
  },
  settings: {
    icon: 'settings',
    labelKey: 'navigation.settings',
  },
}

/** Tablet breakpoint (768dp) — show labels on tablet, icons only on phone */
const TABLET_BREAKPOINT = 768

/** Phone tab bar style — default height */
const PHONE_TAB_BAR_STYLE = {
  backgroundColor: 'transparent' as const,
  borderTopWidth: 0,
  elevation: 0,
  paddingLeft: 8,
  paddingTop: 8,
  paddingRight: 8,
}

/** Tablet tab bar style — taller */
const TABLET_TAB_BAR_STYLE = {
  ...PHONE_TAB_BAR_STYLE,
  height: 90,
}

/**
 * Tab bar background — dark surface with rounded top corners.
 * Extracted as a named component so `tabBarBackground` receives a stable reference.
 * @returns A styled View used as tab bar background
 */
function TabBarBackground() {
  return <View style={[tw`flex-1 bg-nav-bg`]} />
}

/**
 * Main tab navigator layout — 5 content tabs + settings.
 * Tracks the last visited content tab via `screenListeners` for settings referrer navigation.
 * @returns The Expo Router Tabs navigator
 */
export default function TabLayout() {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const isPhone = width < TABLET_BREAKPOINT

  /**
   * Stable screen listeners — tracks last content tab on focus.
   * Uses event target (format: "routeName-randomId") to extract the route name.
   */
  const screenListeners = useMemo(
    () => () => ({
      focus: (e: { target?: string }) => {
        const name = e.target?.split('-')[0]
        if (name) trackContentTab(name)
      },
    }),
    []
  )

  const tabBarStyle = isPhone ? PHONE_TAB_BAR_STYLE : TABLET_TAB_BAR_STYLE

  return (
    <Tabs
      backBehavior="history"
      screenListeners={screenListeners}
      screenOptions={({ route }) => {
        const config = TAB_CONFIG[route.name]

        return {
          headerShown: false,
          tabBarStyle,
          tabBarBackground: TabBarBackground,
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <NavItem
              icon={config?.icon ?? 'navOverview'}
              label={t(config?.labelKey ?? 'navigation.overview')}
              active={
                !!(props['aria-selected'] ?? props.accessibilityState?.selected)
              }
              collapsed={isPhone}
              orientation="column"
              onPress={props.onPress as () => void}
            />
          ),
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('navigation.overview') }} />
      <Tabs.Screen
        name="transactions"
        options={{ title: t('navigation.transactions') }}
      />
      <Tabs.Screen
        name="budgets"
        options={{ title: t('navigation.budgets') }}
      />
      <Tabs.Screen name="pots" options={{ title: t('navigation.pots') }} />
      <Tabs.Screen
        name="recurring"
        options={{ title: t('navigation.recurringBills') }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: t('navigation.settings') }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t('categories.title'),
          href: null,
        }}
      />
    </Tabs>
  )
}
