import { useFormValidation } from '@financial-app/shared'
import {
  Checkbox,
  DatePicker,
  TextInput,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useCallback, useImperativeHandle, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { CategoryDropdown } from '../../categories/CategoryDropdown/CategoryDropdown.native'

import {
  DEFAULT_TRANSACTION_FORM,
  createTransactionFormSchema,
} from './TransactionFormContent.constants'

import type {
  ITransactionFormContentProps,
  ITransactionFormRef,
  TransactionFormData,
} from './TransactionFormContent'
import type { Ref } from 'react'

/** Native-specific props — adds imperative ref handle */
interface ITransactionFormNativeProps extends ITransactionFormContentProps {
  /** Ref exposing getValues() and hasErrors for the route submit handler */
  ref?: Ref<ITransactionFormRef>
}

/**
 * TransactionFormContent — form body for Add/Edit transaction modals (native).
 * Uses useFormValidation for state + Zod validation, exposes values via ref.
 *
 * @param props - Form props including labels, initial values, and ref
 * @returns Form body JSX for the modal
 */
export function TransactionFormContent({
  initialValues,
  categories,
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
}: Readonly<ITransactionFormNativeProps>) {
  const { t } = useTranslation()

  /** Zod schema with translated error messages */
  const schema = useMemo(() => createTransactionFormSchema(t), [t])

  /** Responsible for form state and validation */
  const { formData, errors, validateField, validateForm, hasErrors } =
    useFormValidation<TransactionFormData>(
      schema,
      initialValues ?? DEFAULT_TRANSACTION_FORM
    )

  /** @param value - New name value */
  const onNameChange = useCallback(
    (value: string) => {
      validateField('name', value)
    },
    [validateField]
  )

  /** @param value - New amount value as string */
  const onAmountChange = useCallback(
    (value: string) => {
      const sanitized = value.replace(/[^0-9.-]/g, '')
      validateField('amount', sanitized)
    },
    [validateField]
  )

  /** @param value - New category value */
  const onCategoryChange = useCallback(
    (value: string) => {
      validateField('category_id', value)
    },
    [validateField]
  )

  /** @param value - New date ISO string or null */
  const onDateChange = useCallback(
    (value: string | null) => {
      validateField('date', value ?? '')
    },
    [validateField]
  )

  /** @param checked - New checkbox state */
  const onRecurringChange = useCallback(
    (checked: boolean) => {
      validateField('recurring', checked)
    },
    [validateField]
  )

  useImperativeHandle(ref, () => ({
    getValues: () => formData,
    hasErrors,
    validate: () => validateForm(formData),
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
          value={formData.name}
          onChangeText={onNameChange}
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
          value={formData.amount}
          onChangeText={onAmountChange}
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
        <CategoryDropdown
          categories={categories}
          selectedCategoryId={formData.category_id}
          onSelect={onCategoryChange}
          accessibilityLabel={categoryLabel}
          bottomSheetTitle={categoryLabel}
          alreadyUsedLabel={t('common.alreadyUsed')}
        />
      </View>

      {/* Date */}
      <DatePicker
        label={dateLabel}
        placeholder={datePlaceholder}
        value={formData.date}
        onChange={onDateChange}
        accessibilityLabel={dateLabel}
      />

      {/* Recurring */}
      <Checkbox
        checked={formData.recurring}
        onChange={onRecurringChange}
        label={recurringLabel}
      />
    </View>
  )
}
