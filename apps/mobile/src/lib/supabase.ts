import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@env'
import { createNativeClient } from '@financial-app/shared'
import type { IAuthStorage } from '@financial-app/shared'
import AsyncStorage from '@react-native-async-storage/async-storage'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[auth] Missing env vars: SUPABASE_URL and SUPABASE_ANON_KEY must be set. ' +
      'Check your .env file against .env.example.'
  )
}

const asyncStorageAdapter: IAuthStorage = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key),
}

/** Singleton auth client for the bare RN CLI app — not replaceable at runtime */
export const authClient = createNativeClient(asyncStorageAdapter, {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
})
