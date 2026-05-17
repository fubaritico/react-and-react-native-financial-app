import { useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'

import { isAuthLoadingAtom, userAtom } from '../atoms/auth.atom'

import type { IAuthClient } from './types'

/** Safety timeout — if onAuthStateChange hasn't fired after this delay, unblock the app */
const AUTH_INIT_TIMEOUT_MS = 5000

/**
 * Subscribes to auth state changes and syncs the user to Jotai.
 * Sets isAuthLoadingAtom to false after the first callback — prevents redirect flicker.
 * Includes a safety timeout: if the first callback never fires (e.g. SecureStore delay
 * on iOS cold start), force isAuthLoading=false to unblock AuthGate after 5s.
 * Must be called once at the app root level to keep userAtom in sync.
 * @param authClient - Vendor-agnostic auth client instance (browser or native)
 * @returns void — side-effect only hook (subscribes on mount, unsubscribes on unmount)
 */
export function useAuthListener(authClient: IAuthClient) {
  const setUser = useSetAtom(userAtom)
  const setAuthLoading = useSetAtom(isAuthLoadingAtom)
  const initializedRef = useRef(false)

  useEffect(() => {
    const markReady = () => {
      if (!initializedRef.current) {
        initializedRef.current = true
        setAuthLoading(false)
      }
    }

    const subscription = authClient.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      markReady()
    })

    const timeout = setTimeout(markReady, AUTH_INIT_TIMEOUT_MS)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [authClient, setUser, setAuthLoading])
}
