import { View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './ActionBar.styles'

import type { IActionBarProps } from './ActionBar.tsx'

import { TextInput } from '#Molecules'

/**
 * ActionBar sub-component (native).
 * Renders rightActions + search input in a horizontal row.
 */
export function ActionBar({
  rightActions,
  globalFilterValue,
  onGlobalFilterChange,
  searchPlaceholder = 'Search',
  searchLabel,
}: Readonly<IActionBarProps>) {
  /**
   * called on global filter change will update the table manager state
   * @param value
   */
  const handleGlobalFilterChange = (value: string) => {
    onGlobalFilterChange?.(value)
  }

  return (
    <View style={tw`${shared.container}`}>
      <View style={tw`${rightActions ? 'grow' : 'w-full'}`}>
        <TextInput
          value={globalFilterValue ?? ''}
          onChangeText={handleGlobalFilterChange}
          placeholder={searchPlaceholder}
          accessibilityLabel={searchLabel ?? searchPlaceholder}
          icon="search"
          style="max-w-[320px]"
        />
      </View>
      {rightActions ? (
        <View style={tw`${shared.rightActions}`}>{rightActions}</View>
      ) : null}
    </View>
  )
}
