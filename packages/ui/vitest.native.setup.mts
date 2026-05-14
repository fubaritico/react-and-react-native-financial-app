import { vi } from 'vitest'

vi.mock('react-native-svg', () => {
  const { View } = require('react-native')
  return {
    default: View,
    Svg: View,
    Circle: View,
    Ellipse: View,
    G: View,
    Text: View,
    TSpan: View,
    TextPath: View,
    Path: View,
    Polygon: View,
    Polyline: View,
    Line: View,
    Rect: View,
    Use: View,
    Image: View,
    Symbol: View,
    Defs: View,
    LinearGradient: View,
    RadialGradient: View,
    Stop: View,
    ClipPath: View,
    Pattern: View,
    Mask: View,
    SvgUri: View,
    SvgXml: View,
  }
})
