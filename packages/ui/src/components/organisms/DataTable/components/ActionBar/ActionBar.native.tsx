import { View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './ActionBar.styles'

import type { IActionBarNativeProps } from './ActionBar.tsx'

import { TextInput } from '#Molecules'

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
}: Readonly<IActionBarNativeProps>) {
  return (
    <View style={tw`${shared.container}`}>
      {leftActions && leftActions.length > 0 ? (
        <View style={tw`${shared.leftActions} flex-1`}>{leftActions}</View>
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
