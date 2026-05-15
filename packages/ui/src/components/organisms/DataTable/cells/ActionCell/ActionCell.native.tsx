import { useCallback, useMemo, useRef } from 'react'
import { View } from 'react-native'

import tw from '#Lib/tw'

import { Icon } from '../../../../atoms/Icon/Icon.native'
import { Dropdown } from '../../../../molecules/Dropdown/Dropdown.native'

import type { ActionCellFn, IActionCellConfig } from './ActionCell.tsx'
import type { IDropdownOption } from '../../../../molecules/Dropdown/Dropdown.tsx'
import type { Row } from '@tanstack/react-table'

/** Inner component — avoids hooks-in-callback lint error. */
function ActionCellContent<TData>({
  row,
  config,
}: Readonly<{ row: Row<TData>; config: IActionCellConfig }>) {
  const { onEdit, onDelete, editLabel, deleteLabel } = config
  const rowRef = useRef(row)
  rowRef.current = row

  const options: IDropdownOption[] = useMemo(
    () => [
      { value: 'edit', label: editLabel },
      {
        value: 'delete',
        label: deleteLabel,
        destructive: true,
        dividerBefore: true,
      },
    ],
    [editLabel, deleteLabel]
  )

  const handleSelect = useCallback(
    (value: string) => {
      const r = rowRef.current as unknown as Row<unknown>
      if (value === 'edit') onEdit(r)
      if (value === 'delete') onDelete(r)
    },
    [onEdit, onDelete]
  )

  return (
    <View style={tw`w-12 items-center justify-center`}>
      <Dropdown
        options={options}
        selectedValue=""
        onSelect={handleSelect}
        trigger={() => <Icon name="verticalEllipsis" iconSize="sm" />}
        buttonVariant="tertiary"
        buttonSize="sm"
        buttonClassName="p-0"
        buttonCentered
        buttonFullWidth={false}
        accessibilityLabel="Actions"
      />
    </View>
  )
}

/**
 * Action cell factory (native) — renders a vertical ellipsis dropdown with Edit and Delete options.
 * Used in tablet columnar mode for row-level actions.
 * @param config - callbacks and labels for the action menu
 */
export const ActionCell =
  (config: IActionCellConfig): ActionCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => (
    <ActionCellContent row={row} config={config} />
  )
