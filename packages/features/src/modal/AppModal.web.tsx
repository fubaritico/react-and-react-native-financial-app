import { modalConfigAtom, useModal } from '@financial-app/shared'
import { Modal, Typography } from '@financial-app/ui'
import { useAtomValue } from 'jotai'

import type { IModalProviderProps } from './AppModal'

/**
 * ModalProvider — wraps app content and renders the global Modal when modalConfigAtom is non-null.
 * Mount once in the root layout, inside JotaiProvider.
 */
export function ModalProvider({ children }: Readonly<IModalProviderProps>) {
  const config = useAtomValue(modalConfigAtom)
  const { close } = useModal()

  return (
    <>
      {children}
      {config ? (
        <Modal isOpen onClose={close} accessibilityLabel={config.title}>
          <Modal.Header title={config.title} />
          <Modal.Body>
            {config.description ? (
              <Typography variant="body" color="muted">
                {config.description}
              </Typography>
            ) : null}
            {config.body}
          </Modal.Body>
          <Modal.Footer actions={config.actions} />
        </Modal>
      ) : null}
    </>
  )
}
