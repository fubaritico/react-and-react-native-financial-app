import { modalConfigAtom, useModal } from '@financial-app/shared'
import { Modal } from '@financial-app/ui'
import { useAtomValue } from 'jotai'

import type { IModalRendererProps } from './ModalRenderer'

/**
 * ModalRenderer — wraps app content and renders the global Modal when modalConfigAtom is non-null.
 * Mount once in the root layout, inside JotaiProvider.
 */
export function ModalRenderer({ children }: Readonly<IModalRendererProps>) {
  const config = useAtomValue(modalConfigAtom)
  const { close } = useModal()

  return (
    <>
      {children}
      {config ? (
        <Modal
          isOpen
          onClose={close}
          accessibilityLabel={config.title}
          dismissable={config.dismissable}
        >
          <Modal.Header title={config.title} />
          <Modal.Body>{config.body}</Modal.Body>
          <Modal.Footer
            actions={config.actions}
            cancelLabel={config.cancelLabel}
          />
        </Modal>
      ) : null}
    </>
  )
}
