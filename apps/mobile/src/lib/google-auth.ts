import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@env'
import { signInWithGoogle } from '@financial-app/shared'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { authClient } from './supabase'

/** Configures Google Sign-In SDK. Must be called once at app bootstrap (e.g. App.tsx). */
export function configureGoogleSignIn() {
  if (!GOOGLE_IOS_CLIENT_ID || !GOOGLE_WEB_CLIENT_ID) {
    throw new Error(
      '[auth] Missing Google client IDs. Set GOOGLE_IOS_CLIENT_ID and ' +
        'GOOGLE_WEB_CLIENT_ID in your .env file.'
    )
  }

  GoogleSignin.configure({
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  })
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
