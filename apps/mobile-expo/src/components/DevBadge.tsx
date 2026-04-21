import { StyleSheet, Text, View } from 'react-native'

const LABEL = 'EXPO'
const BG_COLOR = '#1B5E20'

export function DevBadge() {
  if (!__DEV__) return null

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{LABEL}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 50,
    right: 8,
    backgroundColor: BG_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 9999,
    opacity: 0.85,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
})
