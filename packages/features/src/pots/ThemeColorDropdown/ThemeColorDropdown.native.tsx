import {
  ColorDot,
  Dropdown,
  Icon,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useCallback } from 'react'
import { View } from 'react-native'

import type { IDropdownOption } from '@financial-app/ui/native'

import type { IThemeColorDropdownProps } from './ThemeColorDropdown'

/**
 * ThemeColorDropdown — theme color picker with ColorDot in trigger and menu items (native).
 * Disabled items show "Already used" label.
 *
 * @param props - Theme color dropdown options and callbacks
 * @returns Dropdown with color dot indicators
 */
export function ThemeColorDropdown({
  options,
  selectedValue,
  onSelect,
  accessibilityLabel,
  bottomSheetTitle,
  alreadyUsedLabel,
}: Readonly<IThemeColorDropdownProps>) {
  /** Custom trigger — ColorDot + label + caret */
  const renderTrigger = useCallback(
    ({ selectedLabel }: { isOpen: boolean; selectedLabel: string }) => (
      <View style={tw`flex-row items-center gap-3 flex-1`}>
        <ColorDot color={selectedValue} />
        <Typography variant="body" style={tw`flex-1`}>
          {selectedLabel}
        </Typography>
        <Icon
          name="caretDown"
          iconSize="xs"
          color={tw.color('foreground') ?? '#201F24'}
        />
      </View>
    ),
    [selectedValue]
  )

  /** Custom item — ColorDot + label + "Already used" badge */
  const renderItem = useCallback(
    (option: IDropdownOption, { isSelected }: { isSelected: boolean }) => (
      <View style={tw`flex-row items-center gap-3 flex-1`}>
        <ColorDot color={option.value} size={option.disabled ? 12 : 16} />
        <Typography
          variant={isSelected ? 'body-bold' : 'body'}
          color={option.disabled ? 'on-dark-muted' : 'on-dark'}
          style={tw`flex-1`}
        >
          {option.label}
        </Typography>
        {option.disabled ? (
          <Typography variant="caption" color="on-dark-muted">
            {alreadyUsedLabel}
          </Typography>
        ) : null}
      </View>
    ),
    [alreadyUsedLabel]
  )

  return (
    <Dropdown
      options={options}
      selectedValue={selectedValue}
      onSelect={onSelect}
      accessibilityLabel={accessibilityLabel}
      bottomSheetTitle={bottomSheetTitle}
      trigger={renderTrigger}
      renderItem={renderItem}
      buttonFullWidth
      withPortal
    />
  )
}
