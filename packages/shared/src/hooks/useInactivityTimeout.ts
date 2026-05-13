import { useCallback, useEffect, useRef } from 'react'

/**
 * Calls `onTimeout` after the app has been inactive (background/hidden) for `delayMs`.
 * Uses `document.visibilitychange` on web.
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

    const handleVisibility = () => {
      if (document.hidden) {
        timerRef.current = setTimeout(() => {
          if (!firedRef.current) {
            firedRef.current = true
            onTimeout()
          }
        }, delayMs)
      } else {
        clearTimer()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      clearTimer()
    }
  }, [onTimeout, delayMs, clearTimer, enabled])
}
