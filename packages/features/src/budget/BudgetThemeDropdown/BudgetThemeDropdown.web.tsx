import { ColorDot, Dropdown, Icon, Typography } from '@financial-app/ui'
import { useCallback } from 'react'

import type { IDropdownOption } from '@financial-app/ui'

import type { IBudgetThemeDropdownProps } from './BudgetThemeDropdown'

/**
 * BudgetThemeDropdown — theme color picker with ColorDot in trigger and menu items (web).
 * Disabled items show "Already used" label.
 */
export function BudgetThemeDropdown({
  options,
  selectedValue,
  onSelect,
  accessibilityLabel,
  bottomSheetTitle,
  alreadyUsedLabel,
}: Readonly<IBudgetThemeDropdownProps>) {
  /** Custom trigger — ColorDot + label + caret */
  const renderTrigger = useCallback(
    ({ selectedLabel }: { isOpen: boolean; selectedLabel: string }) => (
      <span className="inline-flex items-center gap-3 flex-1">
        <ColorDot color={selectedValue} />
        <Typography variant="body" as="span" className="flex-1 text-left">
          {selectedLabel}
        </Typography>
        <Icon name="caretDown" iconSize="xs" color="currentColor" />
      </span>
    ),
    [selectedValue]
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
      buttonFullWidth
      withPortal
    />
  )
}
