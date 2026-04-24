import { Tabs } from 'expo-router'
import { useTranslation } from 'react-i18next'

import tw from '../../src/lib/tw'

export default function TabLayout() {
  const { t } = useTranslation()

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
    </Tabs>
  )
}
