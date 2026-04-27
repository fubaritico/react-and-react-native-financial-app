import { Avatar } from '../../../../atoms/Avatar/Avatar.web'
import { Typography } from '../../../../atoms/Typography/Typography.web'

import type { AvatarNameCellFn } from './AvatarNameCell'
import type { Row } from '@tanstack/react-table'

/**
 * Avatar + Name cell factory (web).
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
      <div className="flex items-center gap-3">
        <Avatar src={avatar} name={name} size={40} />
        <div>
          <Typography variant="body-bold">{name}</Typography>
          {subtitle ? (
            <Typography variant="caption" color="muted">
              {subtitle}
            </Typography>
          ) : null}
        </div>
      </div>
    )
  }
