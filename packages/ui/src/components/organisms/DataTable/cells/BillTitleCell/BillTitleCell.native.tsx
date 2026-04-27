import { View } from 'react-native'

import tw from '../../../../../lib/tw'
import { Avatar } from '../../../../atoms/Avatar/Avatar.native'
import { Typography } from '../../../../atoms/Typography/Typography.native'
import { TableCell } from '../../components/TableCell/TableCell.native'

import type { BillTitleCellFn } from './BillTitleCell.tsx'
import type { Row } from '@tanstack/react-table'

/**
 * Bill title cell factory (native).
 * Renders avatar with theme color border + bill name.
 * @param avatarKey - accessor key for the avatar URL on row.original
 * @param nameKey - accessor key for the bill name
 * @param themeKey - accessor key for the hex color theme on row.original
 */
export const BillTitleCell =
  (avatarKey: string, nameKey: string, themeKey: string): BillTitleCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const original = row.original as Record<string, string>
    const avatar = original[avatarKey] ?? ''
    const name = row.getValue<string>(nameKey)
    const theme = original[themeKey] ?? ''

    return (
      <TableCell style={tw`flex-row items-center gap-3`}>
        <View
          style={[tw`rounded-full border-l-[4px]`, { borderLeftColor: theme }]}
        >
          <Avatar src={avatar} name={name} size={40} />
        </View>
        <Typography variant="body-bold">{name}</Typography>
      </TableCell>
    )
  }
