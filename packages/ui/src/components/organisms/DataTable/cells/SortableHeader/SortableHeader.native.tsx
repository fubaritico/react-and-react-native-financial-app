import { Pressable, View } from 'react-native'

import tw from '../../../../../lib/tw'
import { Icon } from '../../../../atoms/Icon/Icon.native'
import { Typography } from '../../../../atoms/Typography/Typography.native'
import { TableHead } from '../../components/TableHead/TableHead.native'

import type { HeaderAlign, HeaderCellFn } from './SortableHeader.tsx'
import type { Column } from '@tanstack/react-table'

/**
 * Sortable header cell factory (native).
 * Renders a pressable label that toggles column sort direction.
 * Shows a caret icon only when the column is actively sorted.
 * @param label - header text
 * @param align - text alignment ('left' | 'right'), defaults to 'left'
 */
export const SortableHeader =
  (
    label: string,
    align: HeaderAlign = 'left',
    className?: string,
    dataType?: string
  ): HeaderCellFn =>
  <TData,>({ column }: { column: Column<TData> }) => {
    const sorted = column.getIsSorted()
    const isAsc = sorted === 'asc'

    return (
      <TableHead
        style={[
          tw`${align === 'right' ? 'text-right ml-auto' : 'text-left mr-auto'}`,
          className && tw`${className}`,
        ]}
        data-type={dataType}
      >
        <Pressable
          onPress={() => {
            column.toggleSorting(sorted === 'asc')
          }}
          accessibilityRole="button"
          accessibilityLabel={`Sort by ${label}`}
          accessibilityState={{ selected: !!sorted }}
          style={tw`flex-row items-center gap-1`}
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
      </TableHead>
    )
  }
