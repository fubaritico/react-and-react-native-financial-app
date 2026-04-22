/* eslint-disable @typescript-eslint/no-require-imports */

// Mock react-native-svg (native module used by @financial-app/icons)
jest.mock('react-native-svg', () => {
  const { View } = require('react-native')
  return {
    __esModule: true,
    default: View,
    Svg: View,
    Circle: View,
    Path: View,
    Rect: View,
    G: View,
    Line: View,
    Defs: View,
    ClipPath: View,
  }
})

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 }
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  }
})

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const { View } = require('react-native')
  return {
    enableScreens: jest.fn(),
    Screen: View,
    ScreenContainer: View,
    ScreenStack: View,
    NativeScreen: View,
    NativeScreenContainer: View,
  }
})

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
  }
})

// Mock twrnc (used internally by @financial-app/ui native components)
jest.mock('twrnc', () => ({
  create: () => {
    const handler = {
      get(_target, prop) {
        if (prop === 'style') return () => ({})
        if (prop === 'color') return () => ''
        return () => ({})
      },
      apply() {
        return {}
      },
    }
    const tw = new Proxy(() => ({}), handler)
    tw.style = () => ({})
    tw.color = () => ''
    return tw
  },
}))
