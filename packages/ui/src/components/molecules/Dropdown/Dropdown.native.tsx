import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import type { IconName } from '@financial-app/icons'

import tw from '#Lib/tw'

import { BottomSheet } from '../BottomSheet/BottomSheet.native'
import { Menu } from '../Menu/Menu.native'

import { native } from './Dropdown.styles'

import type { IDropdownProps } from './Dropdown'
import type { ReactNode } from 'react'

import { Button, ColorDot, Divider, Icon, Portal, Typography } from '#Atoms'

/**
 * Native Dropdown — always opens a BottomSheet in dark mode.
 *
 * Trigger button shows the selected label + a caret-down icon.
 * On press, a dark-themed BottomSheet slides up from the bottom with
 * Menu items inside.
 *
 * When `withPortal` is true, the BottomSheet is rendered via Portal
 * so it appears above modal overlays.
 */
export function Dropdown({
  label,
  options,
  selectedValue,
  onSelect,
  accessibilityLabel,
  menuAccessibilityLabel,
  bottomSheetTitle,
  bottomSheetCloseLabel,
  trigger,
  buttonVariant = 'outline',
  buttonSize,
  buttonClassName,
  buttonFullWidth,
  buttonCentered,
  renderItem,
  withPortal,
}: Readonly<IDropdownProps>) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = useMemo(
    () => options.find((o) => o.value === selectedValue),
    [options, selectedValue]
  )

  const selectedLabel = selectedOption?.label ?? selectedValue

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

  const bottomSheet = (
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
            const isSelected = option.value === selectedValue
            const hasOptionMeta = !renderItem && (option.color ?? option.icon)
            items.push(
              <Menu.Item
                key={option.value}
                value={option.value}
                index={index}
                disabled={option.disabled}
                destructive={option.destructive}
                rawContent={!!renderItem || !!hasOptionMeta}
              >
                {renderItem ? (
                  renderItem(option, { isSelected })
                ) : hasOptionMeta ? (
                  <View style={tw`${native.menuItemContent}`}>
                    {option.color ? (
                      <ColorDot color={option.color} size={12} />
                    ) : null}
                    {option.icon ? (
                      <Icon
                        name={option.icon as IconName}
                        iconSize="xs"
                        color="on-dark-muted"
                      />
                    ) : null}
                    <Typography
                      variant="body"
                      color={option.disabled ? 'muted' : undefined}
                    >
                      {option.label}
                    </Typography>
                  </View>
                ) : (
                  option.label
                )}
              </Menu.Item>
            )
            return items
          })}
        </Menu>
      </BottomSheet.Body>
    </BottomSheet>
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
            <View style={tw`${native.triggerContent}`}>
              {selectedOption?.color ? (
                <ColorDot color={selectedOption.color} size={12} />
              ) : null}
              {selectedOption?.icon ? (
                <Icon
                  name={selectedOption.icon as IconName}
                  iconSize="xs"
                  color="foreground"
                />
              ) : null}
              <Typography variant="body-bold">{selectedLabel}</Typography>
            </View>
            <Icon
              name="caretDown"
              iconSize="xs"
              color="foreground"
              style={isOpen ? tw`rotate-180` : undefined}
            />
          </>
        )}
      </Button>

      {withPortal ? <Portal>{bottomSheet}</Portal> : bottomSheet}
    </View>
  )
}
