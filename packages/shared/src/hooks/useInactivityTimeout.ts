import { useCallback, useEffect, useRef } from 'react'

const ACTIVITY_EVENTS = [
  'pointerdown',
  'pointermove',
  'keydown',
  'scroll',
  'touchstart',
] as const

/**
 * Calls `onTimeout` after the app has been inactive for `delayMs`.
 * Detects both tab-hidden (visibilitychange) and idle input (no pointer/key/scroll).
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

  const startTimer = useCallback(() => {
    clearTimer()
    if (firedRef.current) return
    timerRef.current = setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true
        onTimeout()
      }
    }, delayMs)
  }, [clearTimer, delayMs, onTimeout])

  useEffect(() => {
    if (!enabled) {
      clearTimer()
      return
    }

    firedRef.current = false

    // Start idle timer immediately (user may already be idle)
    startTimer()

    // Reset timer on any user activity
    const handleActivity = () => {
      firedRef.current = false
      startTimer()
    }

    // Tab hidden → start timer, tab visible → reset
    const handleVisibility = () => {
      if (document.hidden) {
        startTimer()
      } else {
        handleActivity()
      }
    }

    for (const event of ACTIVITY_EVENTS) {
      document.addEventListener(event, handleActivity, { passive: true })
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        document.removeEventListener(event, handleActivity)
      }
      document.removeEventListener('visibilitychange', handleVisibility)
      clearTimer()
    }
  }, [onTimeout, delayMs, clearTimer, startTimer, enabled])
}
