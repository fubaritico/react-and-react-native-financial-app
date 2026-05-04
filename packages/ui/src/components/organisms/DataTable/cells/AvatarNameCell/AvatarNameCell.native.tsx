import { View } from 'react-native'

import tw from '#Lib/tw'

import { TableCell } from '../../components/TableCell/TableCell.native'

import type { AvatarNameCellFn } from './AvatarNameCell.tsx'
import type { Row } from '@tanstack/react-table'

import { Avatar, Typography } from '#Atoms'

/**
 * Avatar + Name cell factory (native).
 * Renders avatar image + name (bold) + optional subtitle (caption, muted).
 * @param avatarKey - accessor key for the avatar URL on row.original
 * @param nameKey - accessor key for the name
 */
export const AvatarNameCell =
  (avatarKey: string, nameKey: string): AvatarNameCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const original = row.original as Record<string, string>
    const avatar = original[avatarKey] ?? ''
    const name = row.getValue<string>(nameKey)

    return (
      <TableCell>
        <View style={[tw`flex-row items-center gap-3 pr-3 flex-1`]}>
          <Avatar src={avatar} name={name} size={40} />
          <View style={tw`flex-1 w-0`}>
            <Typography variant="body-bold" numberOfLines={1}>
              {name}
            </Typography>
          </View>
        </View>
      </TableCell>
    )
  }
