import { ColorDot, Dropdown, Icon, Typography } from '@financial-app/ui'
import { useCallback } from 'react'

import type { IDropdownOption } from '@financial-app/ui'

import type { IThemeColorDropdownProps } from './ThemeColorDropdown'

/**
 * ThemeColorDropdown — theme color picker with ColorDot in trigger and menu items (web).
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
  placeholder,
  buttonClassName,
}: Readonly<IThemeColorDropdownProps>) {
  const hasSelection = selectedValue !== ''

  /** Custom trigger — ColorDot + label + caret (or placeholder when empty) */
  const renderTrigger = useCallback(
    ({ selectedLabel }: { isOpen: boolean; selectedLabel: string }) => (
      <span className="inline-flex items-center gap-3 flex-1">
        {hasSelection && <ColorDot color={selectedValue} />}
        <Typography
          variant="body"
          as="span"
          color={hasSelection ? 'foreground' : 'beige-500'}
          className="flex-1 text-left"
        >
          {hasSelection ? selectedLabel : placeholder}
        </Typography>
        <Icon name="caretDown" iconSize="xs" color="currentColor" />
      </span>
    ),
    [selectedValue, hasSelection, placeholder]
  )

  /** Custom item — ColorDot + label + "Already used" badge */
  const renderItem = useCallback(
    (option: IDropdownOption, { isSelected }: { isSelected: boolean }) => (
      <span className="inline-flex items-center gap-3 w-full">
        <ColorDot color={option.value} size={option.disabled ? 12 : 16} />
        <Typography
          variant={isSelected ? 'body-bold' : 'body'}
          color={option.disabled ? 'muted' : 'foreground'}
          as="span"
          className="flex-1"
        >
          {option.label}
        </Typography>
        {option.disabled && (
          <Typography variant="caption" color="muted" as="span">
            {alreadyUsedLabel}
          </Typography>
        )}
      </span>
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
      buttonClassName={`h-12${buttonClassName ? ` ${buttonClassName}` : ''}`}
      buttonFullWidth
      withPortal
    />
  )
}
