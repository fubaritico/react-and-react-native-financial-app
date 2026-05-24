import { View } from 'react-native'

import type { IconName } from '@financial-app/icons'

import tw from '#Lib/tw'

import { TableCell } from '../../components/TableCell/TableCell.native'

import type { BillTitleCellFn } from './BillTitleCell.tsx'
import type { Row } from '@tanstack/react-table'

import { Icon, Typography } from '#Atoms'

/**
 * Bill title cell factory (native).
 * Renders category icon circle with colored left border + bill name.
 * @param nameKey - accessor key for the bill name
 * @param iconKey - key on row.original for the IconName
 * @param colorKey - key on row.original for the token color key
 */
export const BillTitleCell =
  (nameKey: string, iconKey: string, colorKey: string): BillTitleCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const original = row.original as Record<string, string>
    const name = row.getValue<string>(nameKey)
    const icon = original[iconKey] as IconName
    const color = original[colorKey] ?? 'blue'

    return (
      <TableCell style={tw`flex-row items-center gap-3`}>
        <View style={tw`rounded-full border-l-4 border-l-${color}`}>
          <View
            style={tw`items-center justify-center rounded-full w-10 h-10 bg-${color}`}
            accessible={false}
          >
            <Icon name={icon} color="white" iconSize="sm" />
          </View>
        </View>
        <Typography variant="body-bold">{name}</Typography>
      </TableCell>
    )
  }
