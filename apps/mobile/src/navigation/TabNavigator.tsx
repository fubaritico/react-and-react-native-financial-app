import { NavItem } from '@financial-app/ui'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTranslation } from 'react-i18next'
import { View, useWindowDimensions } from 'react-native'

import type { IconName } from '@financial-app/icons'

import tw from '../lib/tw'
import { BudgetsScreen } from '../screens/BudgetsScreen'
import { OverviewScreen } from '../screens/OverviewScreen'
import { PotsScreen } from '../screens/PotsScreen'
import { RecurringScreen } from '../screens/RecurringScreen'
import { TransactionsScreen } from '../screens/TransactionsScreen'

import type { TabParamList } from './types'

const Tab = createBottomTabNavigator<TabParamList>()

/** Tab config per screen name */
const TAB_CONFIG: Partial<
  Record<string, { icon: IconName; labelKey: string }>
> = {
  Overview: { icon: 'navOverview', labelKey: 'navigation.overview' },
  Transactions: {
    icon: 'navTransactions',
    labelKey: 'navigation.transactions',
  },
  Budgets: { icon: 'navBudgets', labelKey: 'navigation.budgets' },
  Pots: { icon: 'navPots', labelKey: 'navigation.pots' },
  Recurring: {
    icon: 'navRecurringBills',
    labelKey: 'navigation.recurringBills',
  },
}

/** Tablet breakpoint (768dp) — show labels on tablet, icons only on phone */
const TABLET_BREAKPOINT = 768

/** Bottom tab navigator — mirrors the 5 tabs from mobile-expo (Expo Router). */
export function TabNavigator() {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const isPhone = width < TABLET_BREAKPOINT

  return (
    <Tab.Navigator
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
      <Tab.Screen
        name="Overview"
        component={OverviewScreen}
        options={{ title: t('navigation.overview') }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ title: t('navigation.transactions') }}
      />
      <Tab.Screen
        name="Budgets"
        component={BudgetsScreen}
        options={{ title: t('navigation.budgets') }}
      />
      <Tab.Screen
        name="Pots"
        component={PotsScreen}
        options={{ title: t('navigation.pots') }}
      />
      <Tab.Screen
        name="Recurring"
        component={RecurringScreen}
        options={{ title: t('navigation.recurringBills') }}
      />
    </Tab.Navigator>
  )
}
