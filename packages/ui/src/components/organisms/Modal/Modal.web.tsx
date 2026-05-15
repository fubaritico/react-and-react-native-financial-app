import { useCallback, useEffect, useMemo, useRef } from 'react'

import { cn } from '#Lib/cn'

import { Button, Icon, Typography } from '#Atoms/index.web'

import { shared, web } from './Modal.styles'
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

/** Modal.Header — title + close (X) button (hidden when dismissable is false) */
function ModalHeader({ title, closeLabel }: Readonly<IModalHeaderProps>) {
  const { onClose, dismissable } = useModalContext()

  if (!title && !dismissable) return null

  return (
    <div className={cn(shared.header, 'flex')}>
      {title ? (
        <Typography variant="heading-xl" color="foreground" className="flex-1">
          {title}
        </Typography>
      ) : (
        <div className="flex-1" />
      )}
      {dismissable ? (
        <button
          type="button"
          onClick={onClose}
          className={cn(shared.closeButton, 'flex', web.closeButton)}
          aria-label={closeLabel}
        >
          <Icon
            name="closeModal"
            iconSize="3xl"
            color="var(--color-grey-500)"
          />
        </button>
      ) : null}
    </div>
  )
}

/** Modal.Body — scrollable content area */
function ModalBody({ children }: Readonly<IModalBodyProps>) {
  return <div className={cn(shared.body, web.body)}>{children}</div>
}

/** Modal.Footer — action buttons + cancel (cancel hidden when dismissable is false) */
function ModalFooter({
  actions,
  cancelLabel,
  isSubmitting,
}: Readonly<IModalFooterProps>) {
  const { onClose, dismissable } = useModalContext()
  return (
    <div className={cn(shared.footer, 'flex flex-col')}>
      {actions.map((action) => {
        const isPrimary =
          action.variant === 'primary' || action.variant === 'destroy'
        return (
          <Button
            key={action.label}
            title={action.label}
            variant={action.variant}
            onPress={action.onPress}
            disabled={action.disabled ?? (isSubmitting && !isPrimary)}
            loading={isPrimary && isSubmitting}
            fullWidth
            centered
          />
        )
      })}
      {dismissable ? (
        <Button
          title={cancelLabel}
          variant="secondary"
          onPress={onClose}
          disabled={isSubmitting}
          fullWidth
          centered
        />
      ) : null}
    </div>
  )
}

/**
 * Modal — compound component (organism).
 *
 * Renders a centered dialog with Portal, backdrop, focus trap, and Escape-to-close on web.
 * Use Modal.Header, Modal.Body, Modal.Footer as children.
 */
function Modal({
  isOpen,
  onClose,
  children,
  accessibilityLabel,
  dismissable = true,
}: Readonly<IModalProps>) {
  const ctx = useMemo(() => ({ onClose, dismissable }), [onClose, dismissable])
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  /** Close on Escape key (when dismissable) + trap Tab within dialog */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissable) {
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
    [onClose, dismissable]
  )

  /** Close on backdrop click (disabled when not dismissable) */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (dismissable && e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose, dismissable]
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
        className={web.overlay}
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
          className={cn(modalPanelVariants({}), web.panel)}
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
