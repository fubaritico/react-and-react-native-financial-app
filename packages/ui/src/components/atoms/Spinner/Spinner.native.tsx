import { useEffect, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'

import tw from '#Lib/tw'

import type { ISpinnerProps } from './Spinner'

/** Default foreground token color */
const DEFAULT_COLOR = '#201f24'

/** Native spinner — 3/4 solid arc + 1/4 semi-transparent, rotating with ease-in-out inertia. */
export function Spinner({ size = 40, color }: Readonly<ISpinnerProps>) {
  const rotation = useRef(new Animated.Value(0)).current
  const resolvedColor = color ?? tw.color('foreground') ?? DEFAULT_COLOR

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      })
    )
    animation.start()
    return () => {
      animation.stop()
    }
  }, [rotation])

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const borderWidth = Math.max(3, Math.round(size / 10))

  return (
    <View
      style={tw`flex-1 items-center justify-center`}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    >
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor: `${resolvedColor}33`,
          borderTopColor: resolvedColor,
          borderRightColor: resolvedColor,
          borderBottomColor: resolvedColor,
          transform: [{ rotate: spin }],
        }}
      />
    </View>
  )
}
