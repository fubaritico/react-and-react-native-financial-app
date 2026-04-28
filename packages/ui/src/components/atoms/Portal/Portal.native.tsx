import { Modal } from 'react-native'

import type { IPortalProps } from './Portal'

/**
 * Native Portal — renders children in a transparent RN Modal
 * so they appear above the current screen content.
 */
export function Portal({ children }: Readonly<IPortalProps>) {
  return (
    <Modal transparent animationType="none" statusBarTranslucent>
      {children}
    </Modal>
  )
}
