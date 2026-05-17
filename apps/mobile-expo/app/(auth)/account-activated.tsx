import { AccountActivatedScreen } from '@financial-app/features'
import { router } from 'expo-router'
import { useCallback } from 'react'

export default function AccountActivated() {
  const handleContinue = useCallback(() => {
    router.replace('/totp-enroll')
  }, [])

  return <AccountActivatedScreen onContinue={handleContinue} />
}
