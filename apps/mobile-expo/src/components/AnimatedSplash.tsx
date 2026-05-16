import { DotLottie } from '@lottiefiles/dotlottie-react-native'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/no-require-imports -- Metro asset resolution requires require() for binary assets
const splashSource = require('../../assets/splash-animation.lottie')

/** Animation duration: 120 frames @ 30fps = 4000ms + 500ms buffer for last frame render */
const SPLASH_DURATION_MS = 4500

interface IAnimatedSplashProps {
  onFinish: () => void
}

/** Full-screen animated splash — plays .lottie file, waits for full duration, then calls onFinish */
export function AnimatedSplash({ onFinish }: Readonly<IAnimatedSplashProps>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish()
    }, SPLASH_DURATION_MS)
    return () => {
      clearTimeout(timer)
    }
  }, [onFinish])

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <DotLottie
        source={splashSource}
        autoplay
        loop={false}
        style={styles.animation}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 300,
    height: 300,
  },
})
