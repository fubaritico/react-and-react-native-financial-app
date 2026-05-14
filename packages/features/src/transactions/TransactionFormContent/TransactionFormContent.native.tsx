import { useFormValidation } from '@financial-app/shared'
import {
  Checkbox,
  DatePicker,
  Dropdown,
  TextInput,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useCallback, useImperativeHandle, useMemo, useState } from 'react'
import { View } from 'react-native'

import {
  DEFAULT_TRANSACTION_FORM,
  TRANSACTION_CATEGORIES,
  transactionFormSchema,
} from './TransactionFormContent.constants'

import type { ITransactionFormContentProps } from './TransactionFormContent'

/**
 * TransactionFormContent — form body for Add/Edit transaction modals (native).
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
  dateLabel,
  datePlaceholder,
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
  const [date, setDate] = useState<string | null>(
    initialValues?.date ?? DEFAULT_TRANSACTION_FORM.date
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
      date: date ?? DEFAULT_TRANSACTION_FORM.date,
      amount: Number(amount),
      recurring,
    }),
    hasErrors,
  }))

  return (
    <View style={tw`gap-4`}>
      {description ? (
        <Typography variant="body" color="muted">
          {description}
        </Typography>
      ) : null}

      {/* Name */}
      <View style={tw`gap-1`}>
        <TextInput
          label={nameLabel}
          value={name}
          onChangeText={setName}
          placeholder={namePlaceholder}
          accessibilityLabel={nameLabel}
          error={!!errors.name}
          helperText={errors.name}
        />
      </View>

      {/* Amount */}
      <View style={tw`gap-1`}>
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
      </View>

      {/* Category */}
      <View style={tw`gap-1`}>
        <Typography variant="body-bold" color="foreground">
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
      </View>

      {/* Date */}
      <DatePicker
        label={dateLabel}
        placeholder={datePlaceholder}
        value={date}
        onChange={setDate}
        accessibilityLabel={dateLabel}
      />

      {/* Recurring */}
      <Checkbox
        checked={recurring}
        onChange={handleRecurringChange}
        label={recurringLabel}
      />
    </View>
  )
}
