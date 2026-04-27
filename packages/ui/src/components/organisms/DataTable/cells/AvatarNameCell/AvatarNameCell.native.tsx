import { View } from 'react-native'

import tw from '../../../../../lib/tw'
import { Avatar } from '../../../../atoms/Avatar/Avatar.native'
import { Typography } from '../../../../atoms/Typography/Typography.native'

import type { AvatarNameCellFn } from './AvatarNameCell'
import type { Row } from '@tanstack/react-table'

/**
 * Avatar + Name cell factory (native).
 * Renders avatar image + name (bold) + optional subtitle (caption, muted).
 * @param avatarKey - accessor key for the avatar URL on row.original
 * @param nameKey - accessor key for the name
 * @param subtitleKey - optional accessor key for a subtitle line (e.g. category)
 */
export const AvatarNameCell =
  (
    avatarKey: string,
    nameKey: string,
    subtitleKey?: string
  ): AvatarNameCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const original = row.original as Record<string, string>
    const avatar = original[avatarKey] ?? ''
    const name = row.getValue<string>(nameKey)
    const subtitle = subtitleKey ? row.getValue<string>(subtitleKey) : undefined

    return (
      <View style={tw`flex-row items-center gap-3`}>
        <Avatar src={avatar} name={name} size={40} />
        <View>
          <Typography variant="body-bold">{name}</Typography>
          {subtitle ? (
            <Typography variant="caption" color="muted">
              {subtitle}
            </Typography>
          ) : null}
        </View>
      </View>
    )
  }
