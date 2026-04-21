import { ScrollView, Text, View } from 'react-native'

/**
 * Overview (home) tab — placeholder.
 * Will be populated with BalanceCard, TransactionsOverview, BudgetsOverview,
 * PotsOverview, RecurringBillsOverview components from Track B + mock data from Step 7.4.
 */
export default function OverviewScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F8F4F0' }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          marginBottom: 24,
          marginTop: 40,
        }}
      >
        Overview
      </Text>
      <View
        style={{
          backgroundColor: '#201F24',
          borderRadius: 12,
          padding: 20,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: '#B3B3B3', fontSize: 12 }}>Current Balance</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 'bold' }}>
          $4,836.00
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <Text style={{ color: '#696868', fontSize: 12 }}>Income</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>$3,814.25</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <Text style={{ color: '#696868', fontSize: 12 }}>Expenses</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>$1,700.50</Text>
        </View>
      </View>
      <Text style={{ color: '#696868', textAlign: 'center', marginTop: 40 }}>
        Placeholder - components from Track B will replace this
      </Text>
    </ScrollView>
  )
}
