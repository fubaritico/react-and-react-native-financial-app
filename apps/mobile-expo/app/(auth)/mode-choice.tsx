import { ModeChoiceScreen } from '@financial-app/features'
import { router } from 'expo-router'
import { useCallback } from 'react'

/**
 * Mode choice route — user selects Manual or Bank mode.
 * @returns The mode choice screen
 */
export default function ModeChoice() {
  const handleSelectManual = useCallback(() => {
    router.replace('/initial-balance')
  }, [])

  return <ModeChoiceScreen onSelectManual={handleSelectManual} />
}
