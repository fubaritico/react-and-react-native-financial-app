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
  categories,
  selectedCategoryId,
  onSelect,
  existingCategoryIds = [],
  accessibilityLabel,
  bottomSheetTitle,
  alreadyUsedLabel,
}: Readonly<ICategoryDropdownProps>) {
  /** Map ICategory[] to IDropdownOption[] with disabled state for existing categories */
  const options = useMemo(
    () =>
      categories.map((c) => ({
        value: c.id,
        label: c.name,
        color: c.color,
        icon: c.icon,
        disabled:
          existingCategoryIds.includes(c.id) && c.id !== selectedCategoryId,
      })),
    [categories, existingCategoryIds, selectedCategoryId]
  )

  /** Custom trigger — ColorDot + Icon + label + caret */
  const renderTrigger = useCallback(
    ({ selectedLabel }: { selectedLabel: string }) => {
      const selected = categories.find((c) => c.id === selectedCategoryId)
      return (
        <span className="inline-flex items-center gap-3 flex-1">
          {selected && (
            <>
              <ColorDot color={selected.color} />
              <Icon name={selected.icon} iconSize="sm" color="currentColor" />
            </>
          )}
          <Typography variant="body" as="span" className="flex-1 text-left">
            {selectedLabel}
          </Typography>
          <Icon name="caretDown" iconSize="xs" color="currentColor" />
        </span>
      )
    },
    [categories, selectedCategoryId]
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
