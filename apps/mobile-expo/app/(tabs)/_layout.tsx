import { NavItem } from '@financial-app/ui'
import { Tabs } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View, useWindowDimensions } from 'react-native'

import type { IconName } from '@financial-app/icons'

import { authClient } from '../../src/lib/supabase'
import tw from '../../src/lib/tw'

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
  'sign-out': {
    icon: 'logout',
    labelKey: 'auth.signOut',
  },
}

/** Tablet breakpoint (768dp) — show labels on tablet, icons only on phone */
const TABLET_BREAKPOINT = 768

export default function TabLayout() {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const isPhone = width < TABLET_BREAKPOINT

  return (
    <Tabs
      screenOptions={({ route }) => {
        const config = TAB_CONFIG[route.name]

        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            paddingLeft: 8,
            paddingTop: 8,
            paddingRight: 8,
            ...(isPhone ? {} : { height: 90 }),
          },
          tabBarBackground: () => (
            <View
              style={{
                flex: 1,
                backgroundColor: tw.color('nav-bg'),
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            />
          ),
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
        name="sign-out"
        options={{ title: t('auth.signOut') }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault()
            void authClient.signOut()
          },
        }}
      />
    </Tabs>
  )
}
