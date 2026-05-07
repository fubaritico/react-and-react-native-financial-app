import { useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'

import { isAuthLoadingAtom, userAtom } from '../atoms/auth.atom'

import type { IAuthClient } from './types'

/**
 * Subscribes to auth state changes and syncs the user to Jotai.
 * Sets isAuthLoadingAtom to false after the first callback — prevents redirect flicker.
 * Must be called once at the app root level to keep userAtom in sync.
 * @param authClient - Vendor-agnostic auth client instance (browser or native)
 * @returns void — side-effect only hook (subscribes on mount, unsubscribes on unmount)
 */
export function useAuthListener(authClient: IAuthClient) {
  const setUser = useSetAtom(userAtom)
  const setAuthLoading = useSetAtom(isAuthLoadingAtom)
  const initializedRef = useRef(false)

  useEffect(() => {
    const subscription = authClient.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!initializedRef.current) {
        initializedRef.current = true
        setAuthLoading(false)
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [authClient, setUser, setAuthLoading])
}
