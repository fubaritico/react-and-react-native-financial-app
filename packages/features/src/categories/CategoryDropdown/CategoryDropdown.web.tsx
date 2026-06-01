import { ColorDot, Dropdown, Icon, Typography } from '@financial-app/ui'
import { useCallback, useMemo } from 'react'

import type { IconName } from '@financial-app/icons'
import type { IDropdownOption } from '@financial-app/ui'

import type { ICategoryDropdownProps } from './CategoryDropdown'

/**
 * CategoryDropdown — category picker with color dot + icon in trigger and menu items (web).
 * Internalizes the ICategory[] → IDropdownOption[] mapping.
 * Disabled items show "Already used" label.
 *
 * @param props - Category dropdown options and callbacks
 * @returns Dropdown with category color dot and icon indicators
 */
export function CategoryDropdown({
  options,
  selectedCategoryId,
  onSelect,
  existingCategoryIds = [],
  accessibilityLabel,
  bottomSheetTitle,
  alreadyUsedLabel,
  placeholder,
}: Readonly<ICategoryDropdownProps>) {
  const hasSelection = selectedCategoryId !== ''

  /** Map ICategory[] to IDropdownOption[] with disabled state for existing options */
  const dropdownOptions = useMemo(
    () =>
      options.map((c) => ({
        value: c.id,
        label: c.name,
        color: c.color,
        icon: c.icon,
        disabled:
          existingCategoryIds.includes(c.id) && c.id !== selectedCategoryId,
      })),
    [options, existingCategoryIds, selectedCategoryId]
  )

  /** Custom trigger — ColorDot + Icon + label + caret (or placeholder when empty) */
  const renderTrigger = useCallback(
    ({ selectedLabel }: { isOpen: boolean; selectedLabel: string }) => {
      const selected = options.find((c) => c.id === selectedCategoryId)
      return (
        <span className="inline-flex items-center gap-3 flex-1">
          {hasSelection && selected && (
            <>
              <ColorDot color={selected.color} />
              <Icon name={selected.icon} iconSize="sm" color="currentColor" />
            </>
          )}
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
      )
    },
    [options, selectedCategoryId, hasSelection, placeholder]
  )

  /** Custom item — ColorDot + Icon + label + "Already used" badge */
  const renderItem = useCallback(
    (option: IDropdownOption, { isSelected }: { isSelected: boolean }) => (
      <span className="inline-flex items-center gap-3 w-full">
        <ColorDot color={option.color ?? ''} size={option.disabled ? 12 : 16} />
        {option.icon && (
          <Icon
            name={option.icon as IconName}
            iconSize="sm"
            color="currentColor"
          />
        )}
        <Typography
          variant={isSelected ? 'body-bold' : 'body'}
          color="inherit"
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
      options={dropdownOptions}
      selectedValue={selectedCategoryId}
      onSelect={onSelect}
      accessibilityLabel={accessibilityLabel}
      bottomSheetTitle={bottomSheetTitle}
      trigger={renderTrigger}
      renderItem={renderItem}
      buttonClassName="h-12"
      buttonFullWidth
      withPortal
    />
  )
}
