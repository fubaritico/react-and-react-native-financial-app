import { cn } from '../../../../lib/cn'
import { TextInput } from '../../../molecules/TextInput/TextInput.web'

import { actionBarStyles } from './ActionBar.styles'

import type { IActionBarProps } from './ActionBar'

/**
 * ActionBar sub-component (web).
 * Renders leftActions + search input in a horizontal row.
 */
export function ActionBar({
  leftActions,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search',
  searchLabel = 'Search',
}: IActionBarProps) {
  return (
    <div className={cn(actionBarStyles.container)}>
      {leftActions && leftActions.length > 0 ? (
        <div className={cn(actionBarStyles.leftActions, 'flex-1')}>
          {leftActions}
        </div>
      ) : null}
      <div
        className={leftActions && leftActions.length > 0 ? 'flex-1' : 'w-full'}
      >
        <TextInput
          label={searchLabel}
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder={searchPlaceholder}
          icon="search"
        />
      </div>
    </div>
  )
}
