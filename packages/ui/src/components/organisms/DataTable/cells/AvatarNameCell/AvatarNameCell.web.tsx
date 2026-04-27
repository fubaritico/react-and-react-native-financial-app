import { Avatar } from '../../../../atoms/Avatar/Avatar.web'
import { Typography } from '../../../../atoms/Typography/Typography.web'
import { TableCell } from '../../components/TableCell/TableCell.web'

import type { AvatarNameCellFn } from './AvatarNameCell.tsx'
import type { Row } from '@tanstack/react-table'

/**
 * Avatar + Name cell factory (web).
 * Renders avatar image + name (bold) + optional subtitle (caption, muted).
 * @param avatarKey - accessor key for the avatar URL on row.original
 * @param nameKey - accessor key for the name
 * @param subtitleKey - optional accessor key for a subtitle line (e.g. category)
 */
export const AvatarNameCell =
  (avatarKey: string, nameKey: string): AvatarNameCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const original = row.original as Record<string, string>
    const avatar = original[avatarKey] ?? ''
    const name = row.getValue<string>(nameKey)

    return (
      <TableCell>
        <div className="flex items-center gap-3 min-w-0 pr-3">
          <Avatar src={avatar} name={name} size={40} />
          <Typography variant="body-bold" as="span" className="truncate">
            {name}
          </Typography>
        </div>
      </TableCell>
    )
  }
