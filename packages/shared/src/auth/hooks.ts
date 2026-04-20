import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { userAtom } from '../atoms/auth.atom'

import type { IAuthClient } from './types'

/**
 * Subscribes to auth state changes and syncs the user to Jotai.
 * Must be called once at the app root level to keep userAtom in sync.
 * @param authClient - Vendor-agnostic auth client instance (browser or native)
 * @returns void — side-effect only hook (subscribes on mount, unsubscribes on unmount)
 */
export function useAuthListener(authClient: IAuthClient) {
  const setUser = useSetAtom(userAtom)

  useEffect(() => {
    const subscription = authClient.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [authClient, setUser])
}
