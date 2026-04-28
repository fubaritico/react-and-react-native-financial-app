import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { cn } from '#Lib/cn'

import { Button, Icon, Portal, Typography } from '#Atoms/index.web'

import { Drawer } from '../Drawer/Drawer.web'
import { Menu } from '../Menu/Menu.web'

import type { IDropdownProps } from './Dropdown'

const LG_BREAKPOINT = 1024

/** Gap in px between the trigger and the floating menu */
const MENU_GAP = 8

/**
 * Web Dropdown — responsive compound component.
 *
 * - Desktop (lg+): opens a floating Menu below (or above) the trigger
 * - Mobile/tablet (< lg): opens a full-width Drawer from the bottom
 *
 * When `withPortal` is true the floating menu is rendered in a Portal,
 * escaping overflow-hidden ancestors. The menu auto-flips above the
 * trigger when there isn't enough space below; if both directions
 * overflow, it defaults to below.
 *
 * Trigger button shows the selected label + a caret-down icon.
 * Full keyboard support via Menu (ArrowUp/Down, Enter, Escape).
 */
export function Dropdown({
  label,
  options,
  selectedValue,
  onSelect,
  accessibilityLabel,
  menuAccessibilityLabel,
  drawerTitle,
  drawerCloseLabel = 'Close',
  withPortal,
  trigger,
}: Readonly<IDropdownProps>) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuWrapperRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const selectedLabel = useMemo(
    () =>
      options.find((o) => o.value === selectedValue)?.label ?? selectedValue,
    [options, selectedValue]
  )

  // Responsive breakpoint
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${String(LG_BREAKPOINT)}px)`)
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
    }
    mq.addEventListener('change', handler)
    return () => {
      mq.removeEventListener('change', handler)
    }
  }, [])

  /** Toggles the dropdown open/closed */
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  /** Closes the dropdown and returns focus to the trigger */
  const handleClose = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  /** Selects a value and closes the dropdown */
  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value)
      handleClose()
    },
    [onSelect, handleClose]
  )

  // Close on click outside (desktop menu mode)
  useEffect(() => {
    if (!isOpen || !isDesktop) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        menuWrapperRef.current &&
        !menuWrapperRef.current.contains(target)
      ) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isDesktop, handleClose])

  // --- Placement state ---
  const [flipped, setFlipped] = useState(false)
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({})

  /** Measures available space and positions the menu, flipping above if needed */
  useLayoutEffect(() => {
    if (!isOpen || !isDesktop) {
      setFlipped(false)
      return
    }
    const triggerEl = triggerRef.current
    const wrapper = menuWrapperRef.current
    if (!triggerEl || !wrapper) return

    const triggerRect = triggerEl.getBoundingClientRect()
    const menuHeight = wrapper.offsetHeight
    const spaceBelow = window.innerHeight - triggerRect.bottom - MENU_GAP
    const spaceAbove = triggerRect.top - MENU_GAP

    // Flip above only if below overflows AND above has more room; otherwise default below
    const shouldFlip = menuHeight > spaceBelow && spaceAbove > spaceBelow

    setFlipped(shouldFlip)

    if (withPortal) {
      const top = shouldFlip
        ? triggerRect.top - menuHeight - MENU_GAP
        : triggerRect.bottom + MENU_GAP
      setPortalStyle({
        position: 'fixed',
        top,
        right: window.innerWidth - triggerRect.right,
        zIndex: 50,
        minWidth: triggerRect.width,
      })
    }
  }, [isOpen, isDesktop, withPortal])

  const menuItems = options.map((option, index) => (
    <Menu.Item
      key={option.value}
      value={option.value}
      index={index}
      disabled={option.disabled}
    >
      {option.label}
    </Menu.Item>
  ))

  const floatingMenu = (
    <div
      ref={menuWrapperRef}
      style={withPortal ? portalStyle : undefined}
      className={
        withPortal
          ? undefined
          : cn(
              'absolute right-0 z-50 min-w-full',
              flipped ? 'bottom-full mb-2' : 'top-full mt-2'
            )
      }
    >
      <Menu
        selectedValue={selectedValue}
        variant="light"
        onSelect={handleSelect}
        onClose={handleClose}
        accessibilityLabel={menuAccessibilityLabel}
        className="w-max min-w-full"
      >
        {menuItems}
      </Menu>
    </div>
  )

  return (
    <div className="inline-flex items-center gap-3" ref={containerRef}>
      {label && (
        <Typography variant="body" color="muted" as="span">
          {label}
        </Typography>
      )}
      <div className="relative">
        {/* Trigger */}
        {trigger ? (
          <Button
            ref={triggerRef}
            variant="tertiary"
            size="sm"
            onPress={handleToggle}
            ariaHaspopup="listbox"
            ariaExpanded={isOpen}
            ariaControls={isOpen ? menuId : undefined}
            accessibilityLabel={accessibilityLabel}
            className="border-none p-0"
          >
            {trigger({ isOpen, selectedLabel })}
          </Button>
        ) : (
          <Button
            ref={triggerRef}
            variant="outline"
            onPress={handleToggle}
            ariaHaspopup="listbox"
            ariaExpanded={isOpen}
            ariaControls={isOpen ? menuId : undefined}
            accessibilityLabel={
              accessibilityLabel ?? `${label ?? 'Select'}: ${selectedLabel}`
            }
            className={cn(
              'gap-4 transition-colors border-beige-500 text-beige-500',
              isOpen && 'border-beige-500'
            )}
          >
            <Typography variant="body" as="span">
              {selectedLabel}
            </Typography>
            <Icon
              name="caretDown"
              iconSize="xs"
              color="currentColor"
              className={cn('transition-transform', isOpen && 'rotate-180')}
            />
          </Button>
        )}

        {/* Desktop: floating Menu (inline) */}
        {isOpen && isDesktop && !withPortal && floatingMenu}
      </div>

      {/* Desktop: floating Menu (portal) */}
      {isOpen && isDesktop && withPortal && <Portal>{floatingMenu}</Portal>}

      {/* Mobile/tablet: Drawer */}
      {!isDesktop && (
        <Drawer
          open={isOpen}
          onClose={handleClose}
          variant="dark"
          overlay
          accessibilityLabel={menuAccessibilityLabel}
        >
          <Drawer.Header closeLabel={drawerCloseLabel}>
            {drawerTitle ?? label}
          </Drawer.Header>
          <Drawer.Body>
            <Menu
              selectedValue={selectedValue}
              variant="dark"
              onSelect={handleSelect}
              onClose={handleClose}
              accessibilityLabel={menuAccessibilityLabel}
              className="border-0 p-0"
            >
              {menuItems}
            </Menu>
          </Drawer.Body>
        </Drawer>
      )}
    </div>
  )
}
