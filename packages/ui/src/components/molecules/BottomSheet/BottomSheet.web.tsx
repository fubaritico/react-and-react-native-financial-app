import { useCallback, useEffect, useRef } from 'react'

import { cn } from '#Lib/cn'

import { Portal } from '#Atoms/index.web'

import { shared, web } from './BottomSheet.styles'
import { bottomSheetVariants } from './BottomSheet.variants'
import { BottomSheetBody } from './BottomSheetBody.web'
import { BottomSheetContext } from './BottomSheetContext'
import { BottomSheetHeader } from './BottomSheetHeader.web'

import type { IBottomSheetProps } from './BottomSheet'

/**
 * Web BottomSheet — bottom sheet panel rendered in a Portal.
 *
 * Slides up from the bottom of the viewport on open. Closes via the
 * close button, Escape key, or overlay click (when `overlay` is enabled).
 *
 * @example
 * ```tsx
 * <BottomSheet open={isOpen} onClose={close} variant="dark">
 *   <BottomSheet.Header>Sort by</BottomSheet.Header>
 *   <BottomSheet.Body>{children}</BottomSheet.Body>
 * </BottomSheet>
 * ```
 */
function BottomSheet({
  open,
  onClose,
  variant = 'dark',
  overlay = true,
  className,
  children,
  accessibilityLabel,
}: Readonly<IBottomSheetProps>) {
  const wasOpenRef = useRef(false)

  /** Closes the bottom sheet when Escape key is pressed */
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, handleEscape])

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true
    } else {
      wasOpenRef.current = false
    }
  }, [open])

  if (!open) return null

  const shouldAnimate = !wasOpenRef.current

  return (
    <Portal>
      <BottomSheetContext.Provider value={{ variant, onClose }}>
        {overlay && (
          <div
            data-name="bottom-sheet-overlay"
            className={web.overlay}
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        <div
          data-name="bottom-sheet-panel"
          role="dialog"
          aria-modal={overlay}
          aria-label={accessibilityLabel}
          className={cn(
            web.root,
            shouldAnimate && web.animate,
            bottomSheetVariants({ variant }),
            className
          )}
        >
          <div
            className={cn(shared.knob, web.knob, {
              'bg-white/25': variant === 'dark',
              'bg-black/25': variant === 'light',
            })}
            aria-hidden="true"
            data-name="bottom-sheet-knob"
          />
          {children}
        </div>
      </BottomSheetContext.Provider>
    </Portal>
  )
}

BottomSheet.Header = BottomSheetHeader
BottomSheet.Body = BottomSheetBody

export { BottomSheet }
