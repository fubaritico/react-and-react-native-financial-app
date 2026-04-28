import { combineColumnFilters } from './DropdownFilter'

import type { IDropdownFilterProps } from './DropdownFilter'

import { Dropdown } from '#Molecules'

/**
 * DropdownFilter (native).
 * Wraps a Dropdown and manages a single column filter via toggle pattern.
 * Selecting the default label clears the filter, selecting another value sets it.
 */
export function DropdownFilter({
  buttonLabel,
  options,
  filters,
  filterId,
  onFiltersChange,
  accessibilityLabel,
  drawerTitle,
}: Readonly<IDropdownFilterProps>) {
  const allOptions = [{ value: buttonLabel, label: buttonLabel }, ...options]

  const currentValue =
    (filters.find((filter) => filter.id === filterId)?.value as
      | string
      | undefined) ?? buttonLabel

  return (
    <Dropdown
      label={buttonLabel}
      options={allOptions}
      selectedValue={currentValue}
      onSelect={(value) => {
        const newFilters = combineColumnFilters(
          filters,
          filterId,
          value,
          buttonLabel
        )
        onFiltersChange(newFilters)
      }}
      accessibilityLabel={accessibilityLabel}
      drawerTitle={drawerTitle}
    />
  )
}
