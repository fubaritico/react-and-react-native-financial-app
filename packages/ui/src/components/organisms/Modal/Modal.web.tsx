import { useCallback, useEffect, useMemo, useRef } from 'react'

import { cn } from '../../../lib/cn'
import { Button } from '../../atoms/Button/Button.web'
import { Icon } from '../../atoms/Icon/Icon.web'
import { Typography } from '../../atoms/Typography/Typography.web'

import { modalStyles } from './Modal.styles'
import { modalPanelVariants } from './Modal.variants'
import { ModalContext, useModalContext } from './ModalContext'

import type {
  IModalBodyProps,
  IModalFooterProps,
  IModalHeaderProps,
  IModalProps,
} from './Modal'

/** Selector for focusable elements inside the dialog (focus trap) */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Modal.Header — title + close (X) button */
function ModalHeader({ title, closeLabel = 'Close' }: IModalHeaderProps) {
  const { onClose } = useModalContext()
  return (
    <div className={cn(modalStyles.header, 'flex')}>
      <Typography variant="heading-md" color="foreground" className="flex-1">
        {title}
      </Typography>
      <button
        type="button"
        onClick={onClose}
        className={cn(
          modalStyles.closeButton,
          'flex cursor-pointer hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900'
        )}
        aria-label={closeLabel}
      >
        <Icon name="closeModal" iconSize="lg" />
      </button>
    </div>
  )
}

/** Modal.Body — scrollable content area */
function ModalBody({ children }: IModalBodyProps) {
  return (
    <div className={cn(modalStyles.body, 'overflow-y-auto max-h-[60vh]')}>
      {children}
    </div>
  )
}

/** Modal.Footer — action buttons + cancel */
function ModalFooter({ actions, cancelLabel = 'Cancel' }: IModalFooterProps) {
  const { onClose } = useModalContext()
  return (
    <div className={cn(modalStyles.footer, 'flex flex-col')}>
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
    </div>
  )
}

/**
 * Modal — compound component (organism).
 *
 * Renders a centered dialog with Portal, backdrop, focus trap, and Escape-to-close on web.
 * Use Modal.Header, Modal.Body, Modal.Footer as children.
 */
function Modal({ isOpen, onClose, children, accessibilityLabel }: IModalProps) {
  const ctx = useMemo(() => ({ onClose }), [onClose])
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  /** Close on Escape key + trap Tab within dialog */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const dialog = dialogRef.current
        if (!dialog) return

        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onClose]
  )

  /** Close on backdrop click */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      // Store the element that was focused before the modal opened
      triggerRef.current = document.activeElement
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
      // Focus the dialog itself
      dialogRef.current?.focus()
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      // Return focus to the trigger element
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus()
      }
      triggerRef.current = null
    }

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <ModalContext.Provider value={ctx}>
      {/* Fullscreen overlay container */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5"
        onClick={handleBackdropClick}
        role="presentation"
      >
        {/* Dialog panel */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={accessibilityLabel}
          tabIndex={-1}
          className={cn(modalPanelVariants({}), 'shadow-lg focus:outline-none')}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  )
}

Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export { Modal }
