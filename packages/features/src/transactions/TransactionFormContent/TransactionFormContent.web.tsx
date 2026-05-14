import { useFormValidation } from '@financial-app/shared'
import { Checkbox, Dropdown, TextInput, Typography } from '@financial-app/ui'
import { useCallback, useImperativeHandle, useMemo, useState } from 'react'

import {
  DEFAULT_TRANSACTION_FORM,
  TRANSACTION_CATEGORIES,
  transactionFormSchema,
} from './TransactionFormContent.constants'

import type { ITransactionFormContentProps } from './TransactionFormContent'

/**
 * TransactionFormContent — form body for Add/Edit transaction modals (web).
 * Manages its own local state and exposes values via ref.
 */
export function TransactionFormContent({
  initialValues,
  nameLabel,
  namePlaceholder,
  amountLabel,
  amountPlaceholder,
  categoryLabel,
  recurringLabel,
  description,
  ref,
}: Readonly<ITransactionFormContentProps>) {
  const [name, setName] = useState(
    initialValues?.name ?? DEFAULT_TRANSACTION_FORM.name
  )
  const [amount, setAmount] = useState(
    initialValues?.amount != null
      ? String(initialValues.amount)
      : DEFAULT_TRANSACTION_FORM.amount
  )
  const [category, setCategory] = useState(
    initialValues?.category ?? DEFAULT_TRANSACTION_FORM.category
  )
  const [recurring, setRecurring] = useState(initialValues?.recurring ?? false)

  const formData = useMemo(
    () => ({ name, category, amount }),
    [name, category, amount]
  )

  const handleRecurringChange = useCallback((checked: boolean) => {
    setRecurring(checked)
  }, [])

  const { errors, hasErrors } = useFormValidation(
    transactionFormSchema,
    formData
  )

  useImperativeHandle(ref, () => ({
    getValues: () => ({
      name,
      category,
      date: initialValues?.date ?? new Date().toISOString(),
      amount: Number(amount),
      recurring,
    }),
    hasErrors,
  }))

  return (
    <div className="flex flex-col gap-4">
      {description && (
        <Typography variant="body" color="muted">
          {description}
        </Typography>
      )}

      {/* Name */}
      <div className="flex flex-col gap-1">
        <TextInput
          label={nameLabel}
          value={name}
          onChangeText={setName}
          placeholder={namePlaceholder}
          accessibilityLabel={nameLabel}
          error={!!errors.name}
          helperText={errors.name}
        />
      </div>

      {/* Amount */}
      <div className="flex flex-col gap-1">
        <TextInput
          label={amountLabel}
          value={amount}
          onChangeText={setAmount}
          prefix="$"
          placeholder={amountPlaceholder}
          keyboardType="numeric"
          accessibilityLabel={amountLabel}
          error={!!errors.amount}
          helperText={errors.amount}
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <Typography variant="label" color="muted">
          {categoryLabel}
        </Typography>
        <Dropdown
          options={TRANSACTION_CATEGORIES}
          selectedValue={category}
          onSelect={setCategory}
          accessibilityLabel={categoryLabel}
          bottomSheetTitle={categoryLabel}
          withPortal
        />
      </div>

      {/* Recurring */}
      <Checkbox
        checked={recurring}
        onChange={handleRecurringChange}
        label={recurringLabel}
      />
    </div>
  )
}
