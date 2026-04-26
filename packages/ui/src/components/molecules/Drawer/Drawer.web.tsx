import { useCallback, useEffect, useRef } from 'react'

import { cn } from '../../../lib/cn'
import { Portal } from '../../atoms/Portal/Portal.web'

import { drawerVariants } from './Drawer.variants'
import { DrawerBody } from './DrawerBody.web'
import { DrawerContext } from './DrawerContext'
import { DrawerHeader } from './DrawerHeader.web'

import type { IDrawerProps } from './Drawer'

/**
 * Web Drawer — bottom sheet panel rendered in a Portal.
 *
 * Slides up from the bottom of the viewport on open. Closes via the
 * close button, Escape key, or overlay click (when `overlay` is enabled).
 *
 * @example
 * ```tsx
 * <Drawer open={isOpen} onClose={close} variant="dark">
 *   <Drawer.Header>Sort by</Drawer.Header>
 *   <Drawer.Body>{children}</Drawer.Body>
 * </Drawer>
 * ```
 */
function Drawer({
  open,
  onClose,
  variant = 'dark',
  overlay = true,
  className,
  children,
  accessibilityLabel,
}: IDrawerProps) {
  const wasOpenRef = useRef(false)

  /** Closes the drawer when Escape key is pressed */
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
      <DrawerContext.Provider value={{ variant, onClose }}>
        {overlay && (
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        <div
          role="dialog"
          aria-modal={overlay}
          aria-label={accessibilityLabel}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50',
            'flex flex-col max-h-[60vh]',
            'shadow-2xl',
            shouldAnimate && 'motion-safe:animate-slide-up',
            drawerVariants({ variant }),
            className
          )}
        >
          {children}
        </div>
      </DrawerContext.Provider>
    </Portal>
  )
}

Drawer.Header = DrawerHeader
Drawer.Body = DrawerBody

export { Drawer }
