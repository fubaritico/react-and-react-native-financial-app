import { BudgetCategoryCard } from '@financial-app/features'
import { useCallback } from 'react'

import type { IBudgetCategoryCard } from '@financial-app/shared'

/** Props for the BudgetCardItem wrapper */
interface IBudgetCardItemProps {
  /** Budget card data */
  card: IBudgetCategoryCard
  /** Callback receiving the card to edit */
  onEdit: (card: IBudgetCategoryCard) => void
  /** Callback receiving the card to delete */
  onDelete: (card: IBudgetCategoryCard) => void
  /** Label for "Maximum of $X" */
  maximumOfLabel: string
  /** Label for the spent amount */
  spentLabel: string
  /** Label for the remaining amount */
  remainingLabel: string
  /** Title for the latest spending section */
  latestSpendingTitle: string
  /** Label for the "See All" link */
  seeAllLabel: string
  /** Label for the edit action in dropdown */
  editLabel: string
  /** Label for the delete action in dropdown */
  deleteLabel: string
}

/**
 * Wrapper that memoizes the onEdit/onDelete callbacks per card (avoids inline arrow in map).
 * @param props - Budget card data with edit/delete handlers and labels
 * @returns Memoized BudgetCategoryCard JSX
 */
export default function BudgetCardItem({
  card,
  onEdit,
  onDelete,
  ...labels
}: Readonly<IBudgetCardItemProps>) {
  const handleEdit = useCallback(() => {
    onEdit(card)
  }, [card, onEdit])

  const handleDelete = useCallback(() => {
    onDelete(card)
  }, [card, onDelete])

  return (
    <BudgetCategoryCard
      category={card.category}
      maximum={card.maximum}
      spent={card.spent}
      color={card.color}
      items={card.items}
      onEdit={handleEdit}
      onDelete={handleDelete}
      {...labels}
    />
  )
}
