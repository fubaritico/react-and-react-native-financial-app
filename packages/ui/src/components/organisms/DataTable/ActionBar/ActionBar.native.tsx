import { View } from 'react-native'

import tw from '../../../../lib/tw'
import { TextInput } from '../../../molecules/TextInput/TextInput.native'

import { actionBarStyles } from './ActionBar.styles'

import type { IActionBarProps } from './ActionBar'

/**
 * ActionBar sub-component (native).
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
    <View style={tw`${actionBarStyles.container}`}>
      {leftActions && leftActions.length > 0 ? (
        <View style={tw`${actionBarStyles.leftActions} flex-1`}>
          {leftActions}
        </View>
      ) : null}
      <View
        style={tw`${leftActions && leftActions.length > 0 ? 'flex-1' : 'w-full'}`}
      >
        <TextInput
          label={searchLabel}
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder={searchPlaceholder}
          icon="search"
        />
      </View>
    </View>
  )
}
