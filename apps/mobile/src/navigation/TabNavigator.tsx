import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { BudgetsScreen } from '../screens/BudgetsScreen'
import { OverviewScreen } from '../screens/OverviewScreen'
import { PotsScreen } from '../screens/PotsScreen'
import { RecurringScreen } from '../screens/RecurringScreen'
import { TransactionsScreen } from '../screens/TransactionsScreen'

import type { TabParamList } from './types'

const Tab = createBottomTabNavigator<TabParamList>()

/** Bottom tab navigator — mirrors the 5 tabs from mobile-expo (Expo Router). */
export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#B3B3B3',
        tabBarStyle: {
          backgroundColor: '#201F24',
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}
    >
      <Tab.Screen name="Overview" component={OverviewScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Budgets" component={BudgetsScreen} />
      <Tab.Screen name="Pots" component={PotsScreen} />
      <Tab.Screen
        name="Recurring"
        component={RecurringScreen}
        options={{ title: 'Recurring Bills' }}
      />
    </Tab.Navigator>
  )
}
