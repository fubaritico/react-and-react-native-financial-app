import { useFormValidation } from '@financial-app/shared'
import { Dropdown, TextInput, Typography, tw } from '@financial-app/ui/native'
import { useCallback, useImperativeHandle, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { BudgetThemeDropdown } from '../BudgetThemeDropdown/BudgetThemeDropdown.native'

import {
  BUDGET_CATEGORIES,
  DEFAULT_BUDGET_FORM,
  THEME_COLORS,
  createBudgetFormSchema,
} from './BudgetFormContent.constants'

import type {
  BudgetFormValues,
  IBudgetFormContentProps,
  IBudgetFormRef,
} from './BudgetFormContent'
import type { Ref } from 'react'

/** Native-specific props — adds imperative ref handle */
interface IBudgetFormNativeProps extends IBudgetFormContentProps {
  /** Ref exposing getValues() and hasErrors for the route submit handler */
  ref?: Ref<IBudgetFormRef>
}

/**
 * BudgetFormContent — form body for Add/Edit budget modals (native).
 * Uses useFormValidation for state + Zod validation, exposes values via ref.
 *
 * @param props - Form props including labels, initial values, and ref
 * @returns Form body JSX for the modal
 */
export function BudgetFormContent({
  initialValues,
  existingCategories = [],
  existingThemes = [],
  categoryLabel,
  maximumLabel,
  themeLabel,
  maximumPlaceholder,
  alreadyUsedLabel,
  description,
  ref,
}: Readonly<IBudgetFormNativeProps>) {
  const { t } = useTranslation()

  /** Zod schema with translated error messages */
  const schema = useMemo(() => createBudgetFormSchema(t), [t])

  /** Responsible for form state and validation */
  const { formData, errors, validateField, validateForm, hasErrors } =
    useFormValidation<BudgetFormValues>(
      schema,
      initialValues ?? DEFAULT_BUDGET_FORM
    )

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

  useImperativeHandle(ref, () => ({
    getValues: () => formData,
    hasErrors,
    validate: () => validateForm(formData),
  }))

  /** Filter out categories already in use (except current in edit mode) */
  const categoryOptions = useMemo(
    () =>
      BUDGET_CATEGORIES.map((opt) => ({
        ...opt,
        disabled:
          existingCategories.includes(opt.value) &&
          opt.value !== initialValues?.category,
      })),
    [existingCategories, initialValues?.category]
  )

  /** Mark themes already in use (except current in edit mode) */
  const themeOptions = useMemo(
    () =>
      THEME_COLORS.map((opt) => ({
        ...opt,
        disabled:
          existingThemes.includes(opt.value) &&
          opt.value !== initialValues?.theme,
      })),
    [existingThemes, initialValues?.theme]
  )

  return (
    <View style={tw`gap-4`}>
      {description ? (
        <Typography variant="body" color="muted">
          {description}
        </Typography>
      ) : null}
      {/* Category */}
      <View style={tw`gap-1`}>
        <Typography variant="body-bold" color="foreground">
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
      </View>

      {/* Maximum Spend */}
      <View style={tw`gap-1`}>
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
      </View>

      {/* Theme */}
      <View style={tw`gap-1`}>
        <Typography variant="body-bold" color="foreground">
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
      </View>
    </View>
  )
}
