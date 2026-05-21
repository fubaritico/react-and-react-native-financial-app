import { useFormValidation } from '@financial-app/shared'
import { Dropdown, TextInput, Typography } from '@financial-app/ui'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { BudgetThemeDropdown } from '../BudgetThemeDropdown/BudgetThemeDropdown.web'

import {
  BUDGET_CATEGORIES,
  DEFAULT_BUDGET_FORM,
  THEME_COLORS,
  createBudgetFormSchema,
} from './BudgetFormContent.constants'

import type {
  BudgetFormValues,
  IBudgetFormContentProps,
} from './BudgetFormContent'
import type { FormEvent, Ref } from 'react'

/** Web-specific props — adds HTML form element ref */
interface IBudgetFormWebProps extends IBudgetFormContentProps {
  /** Ref to the underlying form element for dataset access */
  ref?: Ref<HTMLFormElement>
}

/**
 * BudgetFormContent — form body for Add/Edit budget modals (web).
 * Uses useFormValidation for state + Zod validation, exposes data via form dataset.
 *
 * @param props - Form props including labels, initial values, and ref
 * @returns Form body JSX for the modal
 */
export function BudgetFormContent({
  initialValues = DEFAULT_BUDGET_FORM,
  existingCategories = [],
  existingThemes = [],
  categoryLabel,
  maximumLabel,
  themeLabel,
  maximumPlaceholder,
  alreadyUsedLabel,
  description,
  ref,
}: Readonly<IBudgetFormWebProps>) {
  const { t } = useTranslation()

  /** Zod schema with translated error messages */
  const schema = useMemo(() => createBudgetFormSchema(t), [t])

  /** Responsible for form state and validation */
  const { formData, errors, validateField, hasErrors, validateForm } =
    useFormValidation<BudgetFormValues>(schema, initialValues)

  /** @param value - New category value */
  const onCategoryChange = useCallback(
    (value: string) => {
      validateField('category', value)
    },
    [validateField]
  )

  /** @param value - New maximum value as string */
  const onMaximumChange = useCallback(
    (value: string) => {
      const sanitized = value.replace(/[^0-9.]/g, '')
      validateField('maximum', sanitized)
    },
    [validateField]
  )

  /** @param value - New theme value */
  const onThemeChange = useCallback(
    (value: string) => {
      validateField('theme', value)
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

  /** Filter out categories already in use (except current in edit mode) */
  const categoryOptions = useMemo(
    () =>
      BUDGET_CATEGORIES.map((opt) => ({
        ...opt,
        disabled:
          existingCategories.includes(opt.value) &&
          opt.value !== initialValues.category,
      })),
    [existingCategories, initialValues.category]
  )

  /** Mark themes already in use (except current in edit mode) */
  const themeOptions = useMemo(
    () =>
      THEME_COLORS.map((opt) => ({
        ...opt,
        disabled:
          existingThemes.includes(opt.value) &&
          opt.value !== initialValues.theme,
      })),
    [existingThemes, initialValues.theme]
  )

  return (
    <form
      id="budget-form"
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
        {/* Category */}
        <div className="flex flex-col gap-1">
          <Typography variant="label" color="muted">
            {categoryLabel}
          </Typography>
          <Dropdown
            options={categoryOptions}
            selectedValue={formData.category}
            onSelect={onCategoryChange}
            accessibilityLabel={categoryLabel}
            bottomSheetTitle={categoryLabel}
            withPortal
          />
        </div>

        {/* Maximum Spend */}
        <div className="flex flex-col gap-1">
          <TextInput
            label={maximumLabel}
            value={formData.maximum}
            onChangeText={onMaximumChange}
            prefix="$"
            placeholder={maximumPlaceholder}
            keyboardType="numeric"
            accessibilityLabel={maximumLabel}
            error={!!errors.maximum}
            helperText={errors.maximum}
          />
        </div>

        {/* Theme */}
        <div className="flex flex-col gap-1">
          <Typography variant="label" color="muted">
            {themeLabel}
          </Typography>
          <BudgetThemeDropdown
            options={themeOptions}
            selectedValue={formData.theme}
            onSelect={onThemeChange}
            accessibilityLabel={themeLabel}
            bottomSheetTitle={themeLabel}
            alreadyUsedLabel={alreadyUsedLabel}
          />
        </div>
      </div>
    </form>
  )
}
