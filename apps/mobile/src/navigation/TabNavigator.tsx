import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTranslation } from 'react-i18next'

import tw from '../lib/tw'
import { BudgetsScreen } from '../screens/BudgetsScreen'
import { OverviewScreen } from '../screens/OverviewScreen'
import { PotsScreen } from '../screens/PotsScreen'
import { RecurringScreen } from '../screens/RecurringScreen'
import { TransactionsScreen } from '../screens/TransactionsScreen'

import type { TabParamList } from './types'

const Tab = createBottomTabNavigator<TabParamList>()

/** Bottom tab navigator — mirrors the 5 tabs from mobile-expo (Expo Router). */
export function TabNavigator() {
  const { t } = useTranslation()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tw.color('on-dark'),
        tabBarInactiveTintColor: tw.color('nav-text'),
        tabBarStyle: {
          backgroundColor: tw.color('nav-bg'),
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: Number(tw.style('text-2xs').fontSize) || 10,
        },
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
