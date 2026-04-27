import { Avatar } from '../../../../atoms/Avatar/Avatar.web'
import { Typography } from '../../../../atoms/Typography/Typography.web'

import type { BillTitleCellFn } from './BillTitleCell'
import type { Row } from '@tanstack/react-table'
import type { CSSProperties } from 'react'

/**
 * Bill title cell factory (web).
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

    const borderStyle = { '--bill-theme': theme } as CSSProperties

    return (
      <div className="flex items-center gap-3" style={borderStyle}>
        <div className="rounded-full border-l-4 border-l-[var(--bill-theme)]">
          <Avatar src={avatar} name={name} size={40} />
        </div>
        <Typography variant="body-bold">{name}</Typography>
      </div>
    )
  }
