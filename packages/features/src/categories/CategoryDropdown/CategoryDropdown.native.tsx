import {
  ColorDot,
  Dropdown,
  Icon,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import type { IconName } from '@financial-app/icons'
import type { IDropdownOption } from '@financial-app/ui/native'

import type { ICategoryDropdownProps } from './CategoryDropdown'

/** Semantic color for icons inside the bottom sheet (dark background) */
const ON_DARK_COLOR = 'on-dark' as const

/**
 * CategoryDropdown — category picker with color dot + icon in trigger and menu items (native).
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
        <View style={tw`flex-row items-center gap-3 flex-1`}>
          {hasSelection && selected ? (
            <>
              <ColorDot color={selected.color} />
              <Icon name={selected.icon} iconSize="sm" />
            </>
          ) : null}
          <Typography
            variant="body"
            color={hasSelection ? undefined : 'beige-500'}
            style={tw`flex-1`}
          >
            {hasSelection ? selectedLabel : placeholder}
          </Typography>
          <Icon name="caretDown" iconSize="xs" />
        </View>
      )
    },
    [options, selectedCategoryId, hasSelection, placeholder]
  )

  /** Custom item — ColorDot + Icon + label + "Already used" badge */
  const renderItem = useCallback(
    (option: IDropdownOption, { isSelected }: { isSelected: boolean }) => (
      <View style={tw`flex-row items-center gap-3 flex-1`}>
        <ColorDot color={option.color ?? ''} size={option.disabled ? 12 : 16} />
        {option.icon ? (
          <Icon
            name={option.icon as IconName}
            iconSize="sm"
            color={ON_DARK_COLOR}
          />
        ) : null}
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
