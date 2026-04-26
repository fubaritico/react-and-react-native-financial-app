import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import tw from '../../../lib/tw'
import { Button } from '../../atoms/Button/Button.native'
import { Icon } from '../../atoms/Icon/Icon.native'
import { Typography } from '../../atoms/Typography/Typography.native'
import { Drawer } from '../Drawer/Drawer.native'
import { Menu } from '../Menu/Menu.native'

import type { IDropdownProps } from './Dropdown'

/**
 * Native Dropdown — always opens a Drawer (bottom sheet) in dark mode.
 *
 * Trigger button shows the selected label + a caret-down icon.
 * On press, a dark-themed Drawer slides up from the bottom with
 * Menu items inside.
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
  trigger,
}: IDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedLabel = useMemo(
    () =>
      options.find((o) => o.value === selectedValue)?.label ?? selectedValue,
    [options, selectedValue]
  )

  /** Toggles the dropdown open/closed */
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  /** Closes the dropdown */
  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  /** Selects a value and closes the dropdown */
  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value)
      handleClose()
    },
    [onSelect, handleClose]
  )

  return (
    <View style={tw`flex-row items-center gap-3`}>
      {label ? (
        <Typography variant="body" color="muted">
          {label}
        </Typography>
      ) : null}

      {/* Trigger */}
      {trigger ? (
        <Button
          variant="tertiary"
          size="sm"
          onPress={handleToggle}
          ariaExpanded={isOpen}
          accessibilityLabel={accessibilityLabel}
          className="border-0 p-0"
        >
          {trigger({ isOpen, selectedLabel })}
        </Button>
      ) : (
        <Button
          variant="outline"
          onPress={handleToggle}
          ariaExpanded={isOpen}
          accessibilityLabel={
            accessibilityLabel ?? `${label ?? 'Select'}: ${selectedLabel}`
          }
          className={`gap-4 ${isOpen ? 'border-foreground' : ''}`}
        >
          <Typography variant="body-bold">{selectedLabel}</Typography>
          <Icon
            name="caretDown"
            iconSize="xs"
            color={tw.color('foreground') ?? '#201F24'}
            style={isOpen ? tw`rotate-180` : undefined}
          />
        </Button>
      )}

      {/* Drawer (always dark on native) */}
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
            accessibilityLabel={menuAccessibilityLabel}
            className="border-0 p-0"
          >
            {options.map((option, index) => (
              <Menu.Item
                key={option.value}
                value={option.value}
                index={index}
                disabled={option.disabled}
              >
                {option.label}
              </Menu.Item>
            ))}
          </Menu>
        </Drawer.Body>
      </Drawer>
    </View>
  )
}
