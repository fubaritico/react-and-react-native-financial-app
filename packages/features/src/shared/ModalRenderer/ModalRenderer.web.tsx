import { modalConfigAtom, useModal } from '@financial-app/shared'
import { Modal } from '@financial-app/ui'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import type { IModalRendererProps } from './ModalRenderer'

/**
 * ModalRenderer — wraps app content and renders the global Modal when modalConfigAtom is non-null.
 * Mount once in the root layout, inside JotaiProvider.
 */
export function ModalRenderer({ children }: Readonly<IModalRendererProps>) {
  const config = useAtomValue(modalConfigAtom)
  const { close } = useModal()
  const { t } = useTranslation()

  return (
    <>
      {children}
      {config ? (
        <Modal
          isOpen
          onClose={close}
          accessibilityLabel={config.title ?? 'Dialog'}
          dismissable={config.dismissable}
        >
          <Modal.Header
            title={config.title}
            closeLabel={config.closeLabel ?? t('modal.close')}
          />
          <Modal.Body>{config.body}</Modal.Body>
          <Modal.Footer
            actions={config.actions}
            cancelLabel={config.cancelLabel ?? t('modal.cancel')}
            isSubmitting={config.isSubmitting}
          />
        </Modal>
      ) : null}
    </>
  )
}
