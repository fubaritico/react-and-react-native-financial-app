import { useCallback, useEffect, useRef } from 'react'

import type { IAuthClient } from '../auth/types'

/** Warning fires this many ms before the token expires */
const LEEWAY_MS = 60_000

/**
 * Watches the current session's `expires_at` and fires `onWarning`
 * when the token is about to expire (LEEWAY_MS before).
 *
 * After warning, the user can call `extend()` to refresh the session
 * and reset the timer, or ignore — the token expires naturally and
 * the 401 interceptor shows the session-expired modal.
 *
 * @param authClient - Vendor-agnostic auth client
 * @param onWarning - Called with an `extend` function when expiry is near
 * @param enabled - When false, the hook is a no-op
 */
export function useSessionExpiry(
  authClient: IAuthClient,
  onWarning: (extend: () => void) => void,
  enabled = true
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onWarningRef = useRef(onWarning)
  onWarningRef.current = onWarning

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const scheduleWarning = useCallback(
    (expiresAt: number) => {
      clearTimer()
      const msUntilWarning = expiresAt * 1000 - Date.now() - LEEWAY_MS
      if (msUntilWarning <= 0) return

      timerRef.current = setTimeout(() => {
        const extend = () => {
          void authClient.refreshSession().then(({ session }) => {
            if (session?.expires_at) {
              scheduleWarning(session.expires_at)
            }
          })
        }
        onWarningRef.current(extend)
      }, msUntilWarning)
    },
    [authClient, clearTimer]
  )

  useEffect(() => {
    if (!enabled) {
      clearTimer()
      return
    }

    void authClient.getSession().then(({ session }) => {
      if (session?.expires_at) {
        scheduleWarning(session.expires_at)
      }
    })

    const subscription = authClient.onAuthStateChange((_event, session) => {
      if (session?.expires_at) {
        scheduleWarning(session.expires_at)
      } else {
        clearTimer()
      }
    })

    return () => {
      subscription.unsubscribe()
      clearTimer()
    }
  }, [authClient, enabled, scheduleWarning, clearTimer])
}
