import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#201F24',
        tabBarInactiveTintColor: '#B3B3B3',
        tabBarStyle: {
          backgroundColor: '#201F24',
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
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
