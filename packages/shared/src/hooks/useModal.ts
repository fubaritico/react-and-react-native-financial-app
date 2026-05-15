import { useAtom } from 'jotai'
import { useCallback } from 'react'

import { modalConfigAtom } from '../atoms/modal.atom'

import type { IModalConfig } from '../atoms/modal.atom'

/**
 * Hook to control the global modal.
 * Call `open(config)` to show a modal, `close()` to dismiss it.
 * @returns `{ open, close, isOpen }` — modal control interface
 */
export function useModal() {
  const [config, setConfig] = useAtom(modalConfigAtom)

  const open = useCallback(
    (modalConfig: IModalConfig) => {
      setConfig(modalConfig)
    },
    [setConfig]
  )

  const close = useCallback(() => {
    setConfig(null)
  }, [setConfig])

  const setSubmitting = useCallback(
    (isSubmitting: boolean) => {
      setConfig((prev) => (prev ? { ...prev, isSubmitting } : prev))
    },
    [setConfig]
  )

  return { open, close, setSubmitting, isOpen: config !== null } as const
}
