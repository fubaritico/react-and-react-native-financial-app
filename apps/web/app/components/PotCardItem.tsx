import { PotCard } from '@financial-app/features'
import { Pot } from '@financial-app/http-client'
import { useCallback } from 'react'

/** Props for the PotCardItem wrapper */
interface IPotCardItemProps {
  /** Pot data */
  pot: Pot
  /** Callback receiving the pot to edit */
  onEdit: (pot: Pot) => void
  /** Callback receiving the pot to delete */
  onDelete: (pot: Pot) => void
  /** Callback receiving the pot to add money to */
  onAddMoney: (pot: Pot) => void
  /** Callback receiving the pot to withdraw from */
  onWithdraw: (pot: Pot) => void
  /** Label translations */
  totalSavedLabel: string
  targetOfLabel: string
  addMoneyLabel: string
  withdrawLabel: string
  editLabel: string
  deleteLabel: string
}

/** Wrapper that memoizes callbacks per pot (avoids inline arrow in map) */
export default function PotCardItem({
  pot,
  onEdit,
  onDelete,
  onAddMoney,
  onWithdraw,
  ...labels
}: Readonly<IPotCardItemProps>) {
  const handleEdit = useCallback(() => {
    onEdit(pot)
  }, [pot, onEdit])

  const handleDelete = useCallback(() => {
    onDelete(pot)
  }, [pot, onDelete])

  const handleAddMoney = useCallback(() => {
    onAddMoney(pot)
  }, [pot, onAddMoney])

  const handleWithdraw = useCallback(() => {
    onWithdraw(pot)
  }, [pot, onWithdraw])

  return (
    <PotCard
      name={pot.name}
      total={pot.total}
      target={pot.target}
      color={pot.theme}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAddMoney={handleAddMoney}
      onWithdraw={handleWithdraw}
      {...labels}
    />
  )
}
