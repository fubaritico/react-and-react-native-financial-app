import { useMemo } from 'react'
import { Pressable, Modal as RNModal, ScrollView, View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './Modal.styles'
import { modalOverlayVariants, modalPanelVariants } from './Modal.variants'
import { ModalContext } from './ModalContext'
import { useModalContext } from './ModalContext'

import type {
  IModalBodyProps,
  IModalFooterProps,
  IModalHeaderProps,
  IModalProps,
} from './Modal'

import { Button, Icon, Typography } from '#Atoms'

/** Modal.Header — title + close (X) button */
function ModalHeader({
  title,
  closeLabel = 'Close',
}: Readonly<IModalHeaderProps>) {
  const { onClose } = useModalContext()
  return (
    <View style={tw`${shared.header}`}>
      <Typography variant="heading-md" color="foreground" style={tw`flex-1`}>
        {title}
      </Typography>
      <Pressable
        onPress={onClose}
        style={tw`${shared.closeButton}`}
        accessibilityRole="button"
        accessibilityLabel={closeLabel}
        accessibilityState={{ disabled: false }}
        hitSlop={8}
      >
        <Icon name="closeModal" iconSize="lg" color={tw.color('foreground')} />
      </Pressable>
    </View>
  )
}

/** Modal.Body — scrollable content area */
function ModalBody({ children }: Readonly<IModalBodyProps>) {
  return <ScrollView style={tw`${shared.body}`}>{children}</ScrollView>
}

/** Modal.Footer — action buttons + cancel */
function ModalFooter({
  actions,
  cancelLabel = 'Cancel',
}: Readonly<IModalFooterProps>) {
  const { onClose } = useModalContext()
  return (
    <View style={tw`${shared.footer}`}>
      {actions.map((action) => (
        <Button
          key={action.label}
          title={action.label}
          variant={action.variant}
          onPress={action.onPress}
          disabled={action.disabled}
          fullWidth
        />
      ))}
      <Button
        title={cancelLabel}
        variant="secondary"
        onPress={onClose}
        fullWidth
      />
    </View>
  )
}

/**
 * Modal — compound component (organism).
 *
 * Renders a centered dialog with backdrop overlay on native (RN Modal).
 * Use Modal.Header, Modal.Body, Modal.Footer as children.
 */
function Modal({
  isOpen,
  onClose,
  children,
  accessibilityLabel,
}: Readonly<IModalProps>) {
  const ctx = useMemo(() => ({ onClose }), [onClose])

  if (!isOpen) return null

  return (
    <RNModal
      transparent
      animationType="fade"
      visible={isOpen}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <ModalContext.Provider value={ctx}>
        <View
          style={tw`flex-1 items-center justify-center px-5`}
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="none"
        >
          {/* Backdrop overlay */}
          <Pressable
            style={tw`${modalOverlayVariants({})}`}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? 'Close'}
          />
          {/* Modal panel */}
          <View style={tw`${modalPanelVariants({})}`}>{children}</View>
        </View>
      </ModalContext.Provider>
    </RNModal>
  )
}

Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export { Modal }
