import { Tabs } from 'expo-router'

import tw from '../../src/lib/tw'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tw.color('nav-active-text'),
        tabBarInactiveTintColor: tw.color('nav-text'),
        tabBarStyle: {
          backgroundColor: tw.color('nav-bg'),
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: Number(tw.style('text-2xs').fontSize) || 10,
          fontFamily: 'PublicSans-Regular',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Overview' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="budgets" options={{ title: 'Budgets' }} />
      <Tabs.Screen name="pots" options={{ title: 'Pots' }} />
      <Tabs.Screen name="recurring" options={{ title: 'Recurring Bills' }} />
    </Tabs>
  )
}
