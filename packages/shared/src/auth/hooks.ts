import type { SupabaseClient } from '@supabase/supabase-js'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { userAtom } from '../atoms/auth.atom'

/**
 * Subscribes to Supabase auth state changes and syncs the user to Jotai.
 * Must be called once at the app root level to keep userAtom in sync.
 * @param supabase - Supabase client instance (browser or native)
 */
export function useAuthListener(supabase: SupabaseClient) {
  const setUser = useSetAtom(userAtom)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, setUser])
}
