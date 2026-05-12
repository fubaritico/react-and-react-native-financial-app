import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import tw from '#Lib/tw'

import { BottomSheet } from '../BottomSheet/BottomSheet.native'
import { Menu } from '../Menu/Menu.native'

import type { IDropdownProps } from './Dropdown'
import type { ReactNode } from 'react'

import { Button, Divider, Icon, Typography } from '#Atoms'

/**
 * Native Dropdown — always opens a BottomSheet in dark mode.
 *
 * Trigger button shows the selected label + a caret-down icon.
 * On press, a dark-themed BottomSheet slides up from the bottom with
 * Menu items inside.
 */
export function Dropdown({
  label,
  options,
  selectedValue,
  onSelect,
  accessibilityLabel,
  menuAccessibilityLabel,
  bottomSheetTitle,
  bottomSheetCloseLabel = 'Close',
  trigger,
  buttonVariant = 'outline',
  buttonSize,
  buttonClassName,
  buttonFullWidth,
  buttonCentered,
}: Readonly<IDropdownProps>) {
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
      <Button
        variant={buttonVariant}
        size={buttonSize}
        centered={buttonCentered}
        onPress={handleToggle}
        ariaExpanded={isOpen}
        accessibilityLabel={
          accessibilityLabel ?? `${label ?? 'Select'}: ${selectedLabel}`
        }
        fullWidth={buttonFullWidth ?? !trigger}
        className={`gap-4 ${buttonClassName ?? ''} ${isOpen ? 'border-foreground' : ''}`}
      >
        {trigger ? (
          trigger({ isOpen, selectedLabel })
        ) : (
          <>
            <Typography variant="body-bold">{selectedLabel}</Typography>
            <Icon
              name="caretDown"
              iconSize="xs"
              color={tw.color('foreground') ?? '#201F24'}
              style={isOpen ? tw`rotate-180` : undefined}
            />
          </>
        )}
      </Button>

      {/* BottomSheet (always dark on native) */}
      <BottomSheet
        open={isOpen}
        onClose={handleClose}
        variant="dark"
        overlay
        accessibilityLabel={menuAccessibilityLabel}
      >
        <BottomSheet.Header closeLabel={bottomSheetCloseLabel}>
          {bottomSheetTitle ?? label}
        </BottomSheet.Header>
        <BottomSheet.Body>
          <Menu
            selectedValue={selectedValue}
            variant="dark"
            onSelect={handleSelect}
            accessibilityLabel={menuAccessibilityLabel}
            className="border-0 p-0"
            shape="square"
          >
            {options.flatMap((option, index) => {
              const items: ReactNode[] = []
              if (option.dividerBefore) {
                items.push(
                  <Divider
                    spacing="md"
                    key={`divider-${option.value}`}
                    className="bg-grey-500/50"
                  />
                )
              }
              items.push(
                <Menu.Item
                  key={option.value}
                  value={option.value}
                  index={index}
                  disabled={option.disabled}
                  destructive={option.destructive}
                >
                  {option.label}
                </Menu.Item>
              )
              return items
            })}
          </Menu>
        </BottomSheet.Body>
      </BottomSheet>
    </View>
  )
}
