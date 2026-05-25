import { useFormValidation } from '@financial-app/shared'
import { Checkbox, DatePicker, TextInput, Typography } from '@financial-app/ui'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CategoryDropdown } from '../../categories/CategoryDropdown/CategoryDropdown.web'

import {
  DEFAULT_TRANSACTION_FORM,
  createTransactionFormSchema,
} from './TransactionFormContent.constants'

import type {
  ITransactionFormContentProps,
  TransactionFormData,
} from './TransactionFormContent'
import type { FormEvent, Ref } from 'react'

/** Web-specific props — adds HTML form element ref */
interface ITransactionFormWebProps extends ITransactionFormContentProps {
  /** Ref to the underlying form element for dataset access */
  ref?: Ref<HTMLFormElement>
}

/**
 * TransactionFormContent — form body for Add/Edit transaction modals (web).
 * Uses useFormValidation for state + Zod validation, exposes data via form dataset.
 *
 * @param props - Form props including labels, initial values, and ref
 * @returns Form body JSX for the modal
 */
export function TransactionFormContent({
  initialValues = DEFAULT_TRANSACTION_FORM,
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
}: Readonly<ITransactionFormWebProps>) {
  const { t } = useTranslation()

  /** Zod schema with translated error messages */
  const schema = useMemo(() => createTransactionFormSchema(t), [t])

  /** Responsible for form state and validation */
  const { formData, errors, validateField, hasErrors, validateForm } =
    useFormValidation<TransactionFormData>(schema, initialValues)

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

  /** @param value - New date ISO string */
  const onDateChange = useCallback(
    (value: string) => {
      validateField('date', value)
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

  /** Handles form submission — prevents default and triggers full validation */
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      validateForm(formData)
    },
    [validateForm, formData]
  )

  return (
    <form
      id="transaction-form"
      ref={ref}
      data-error={hasErrors}
      data-form-data={JSON.stringify(formData)}
      onSubmit={onSubmit}
    >
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
            value={formData.name}
            onChangeText={onNameChange}
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
            value={formData.amount}
            onChangeText={onAmountChange}
            prefix="$"
            placeholder={amountPlaceholder}
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
          <CategoryDropdown
            categories={categories}
            selectedCategoryId={formData.category_id}
            onSelect={onCategoryChange}
            accessibilityLabel={categoryLabel}
            bottomSheetTitle={categoryLabel}
            alreadyUsedLabel={t('common.alreadyUsed')}
          />
        </div>

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
      </div>
    </form>
  )
}
