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
      <TableCell style={tw`flex-row items-center gap-3`}>
        <Avatar src={avatar} name={name} size={40} />
        <View style={tw`min-w-0 shrink`}>
          <Typography variant="body-bold">{name}</Typography>
        </View>
      </TableCell>
    )
  }
