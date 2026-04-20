import { createNativeClient } from '@financial-app/shared'
import type { IAuthStorage } from '@financial-app/shared'
import * as SecureStore from 'expo-secure-store'

const secureStoreAdapter: IAuthStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
}

/** Singleton auth client for the Expo ejected app */
export const authClient = createNativeClient(secureStoreAdapter)
