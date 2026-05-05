import { View, useWindowDimensions } from 'react-native'

import type { IconName } from '@financial-app/icons'

import tw from '#Lib/tw'

import type { BillStatus } from '#Atoms/Status/Status.tsx'

import { TableCell } from '../../components/TableCell/TableCell.native'

import type { CategoryIconCellFn } from './CategoryIconCell.tsx'
import type { Row } from '@tanstack/react-table'

import { Icon, Status, Typography } from '#Atoms'

/** Breakpoint below which Status is shown inside the category cell. */
const MOBILE_BREAKPOINT = 768

/** Inner component that uses hooks — extracted for rules-of-hooks compliance. */
function CategoryIconCellInner<TData>({
  row,
  iconKey,
  colorKey,
  nameKey,
  dateKey,
  statusKey,
}: {
  row: Row<TData>
  nameKey: string
  iconKey: string
  colorKey: string
  dateKey?: string
  statusKey?: string
}) {
  const original = row.original as Record<string, string>
  const name = row.getValue<string>(nameKey)
  const icon = original[iconKey] as IconName
  const color = original[colorKey] ?? '#3F82B2'

  const { width } = useWindowDimensions()
  const isMobile = width < MOBILE_BREAKPOINT

  const showStatus = isMobile && !!dateKey && !!statusKey
  const date = showStatus ? original[dateKey] : undefined
  const status = showStatus ? (original[statusKey] as BillStatus) : undefined

  return (
    <TableCell>
      <View style={tw`w-full gap-1`}>
        <View style={tw`flex-row items-center gap-3 w-full`}>
          <View
            style={[
              tw`items-center justify-center rounded-full`,
              { width: 40, height: 40, backgroundColor: color },
            ]}
          >
            <Icon name={icon} color="white" iconSize="sm" />
          </View>
          <View style={tw`flex-1 w-0`}>
            <Typography variant="body-bold" numberOfLines={1}>
              {name}
            </Typography>
          </View>
        </View>
        {date && status ? <Status date={date} status={status} /> : null}
      </View>
    </TableCell>
  )
}

/**
 * Category icon + name cell factory (native).
 * Renders a colored circle with a category icon + name.
 * When dateKey/statusKey are provided, renders Status below name on phone (<768).
 * @param nameKey - accessor key for the display name
 * @param iconKey - key on row.original for the IconName
 * @param colorKey - key on row.original for the hex background color
 * @param dateKey - optional key on row.original for the ISO date string
 * @param statusKey - optional key on row.original for the BillStatus
 */
export const CategoryIconCell =
  (
    nameKey: string,
    iconKey: string,
    colorKey: string,
    dateKey?: string,
    statusKey?: string
  ): CategoryIconCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => (
    <CategoryIconCellInner
      row={row}
      nameKey={nameKey}
      iconKey={iconKey}
      colorKey={colorKey}
      dateKey={dateKey}
      statusKey={statusKey}
    />
  )
