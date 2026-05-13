import { useCallback, useEffect, useRef } from 'react'
import { AppState } from 'react-native'

import type { AppStateStatus } from 'react-native'

/**
 * Calls `onTimeout` after the app has been in background for `delayMs`.
 * Uses React Native AppState on native.
 * @param onTimeout - Callback fired once when inactivity threshold is exceeded
 * @param delayMs - Inactivity threshold in milliseconds (default: 30_000)
 * @param enabled - When false, the hook is a no-op (default: true)
 */
export function useInactivityTimeout(
  onTimeout: () => void,
  delayMs = 30_000,
  enabled = true
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firedRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      clearTimer()
      return
    }

    firedRef.current = false

    const handleChange = (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        timerRef.current = setTimeout(() => {
          if (!firedRef.current) {
            firedRef.current = true
            onTimeout()
          }
        }, delayMs)
      } else if (nextState === 'active') {
        clearTimer()
      }
    }

    const subscription = AppState.addEventListener('change', handleChange)
    return () => {
      subscription.remove()
      clearTimer()
    }
  }, [onTimeout, delayMs, clearTimer, enabled])
}
