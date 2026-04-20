import { signInWithGoogle } from '@financial-app/shared'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { authClient } from './supabase'

/** Configures Google Sign-In SDK. Must be called once at app bootstrap (e.g. App.tsx). */
export function configureGoogleSignIn() {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID

  if (!iosClientId || !webClientId) {
    throw new Error(
      '[auth] Missing Google client IDs. Set EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID and ' +
        'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in your .env file.'
    )
  }

  GoogleSignin.configure({ iosClientId, webClientId })
}

/** Triggers native Google Sign-In flow and authenticates with Supabase */
export async function handleGoogleSignIn() {
  await GoogleSignin.hasPlayServices()
  const response = await GoogleSignin.signIn()
  if (response.data?.idToken) {
    return signInWithGoogle(authClient, response.data.idToken)
  }
  throw new Error('Google Sign-In failed: no ID token returned')
}
