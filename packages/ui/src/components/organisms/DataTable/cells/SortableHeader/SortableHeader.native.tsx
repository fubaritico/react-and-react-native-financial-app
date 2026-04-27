import { Pressable, View } from 'react-native'

import tw from '../../../../../lib/tw'
import { Icon } from '../../../../atoms/Icon/Icon.native'
import { Typography } from '../../../../atoms/Typography/Typography.native'

import type { HeaderAlign, HeaderCellFn } from './SortableHeader'
import type { Column } from '@tanstack/react-table'

/**
 * Sortable header cell factory (native).
 * Renders a pressable label that toggles column sort direction.
 * Shows a caret icon only when the column is actively sorted.
 * @param label - header text
 * @param align - text alignment ('left' | 'right'), defaults to 'left'
 */
export const SortableHeader =
  (label: string, align: HeaderAlign = 'left'): HeaderCellFn =>
  <TData,>({ column }: { column: Column<TData> }) => {
    const sorted = column.getIsSorted()
    const isAsc = sorted === 'asc'

    return (
      <Pressable
        onPress={() => {
          column.toggleSorting(sorted === 'asc')
        }}
        accessibilityRole="button"
        accessibilityLabel={`Sort by ${label}`}
        accessibilityState={{ selected: !!sorted }}
        style={tw`flex-row items-center gap-1 ${align === 'right' ? 'justify-end' : ''}`}
      >
        <Typography variant="caption" color="muted">
          {label}
        </Typography>
        {sorted ? (
          <View style={isAsc ? tw`rotate-180` : undefined}>
            <Icon
              name="caretDown"
              iconSize="xxs"
              color={tw.color('foreground-muted')}
            />
          </View>
        ) : null}
      </Pressable>
    )
  }
