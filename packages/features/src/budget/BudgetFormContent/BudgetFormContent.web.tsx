import { Dropdown, TextInput, Typography } from '@financial-app/ui'
import { useImperativeHandle, useMemo, useState } from 'react'

import { BudgetThemeDropdown } from '../BudgetThemeDropdown/BudgetThemeDropdown.web'

import {
  BUDGET_CATEGORIES,
  DEFAULT_BUDGET_FORM,
  THEME_COLORS,
} from './BudgetFormContent.constants'

import type { IBudgetFormContentProps } from './BudgetFormContent'

/**
 * BudgetFormContent — form body for Add/Edit budget modals (web).
 * Manages its own local state and exposes values via ref.
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
}: Readonly<IBudgetFormContentProps>) {
  const [category, setCategory] = useState(
    initialValues?.category ?? DEFAULT_BUDGET_FORM.category
  )
  const [maximum, setMaximum] = useState(
    initialValues?.maximum ?? DEFAULT_BUDGET_FORM.maximum
  )
  const [theme, setTheme] = useState(
    initialValues?.theme ?? DEFAULT_BUDGET_FORM.theme
  )

  useImperativeHandle(ref, () => ({
    getValues: () => ({ category, maximum, theme }),
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
          selectedValue={category}
          onSelect={setCategory}
          accessibilityLabel={categoryLabel}
          bottomSheetTitle={categoryLabel}
          withPortal
        />
      </div>

      {/* Maximum Spend */}
      <div className="flex flex-col gap-1">
        <TextInput
          label={maximumLabel}
          value={maximum}
          onChangeText={setMaximum}
          prefix="$"
          placeholder={maximumPlaceholder}
          keyboardType="numeric"
          accessibilityLabel={maximumLabel}
        />
      </div>

      {/* Theme */}
      <div className="flex flex-col gap-1">
        <Typography variant="label" color="muted">
          {themeLabel}
        </Typography>
        <BudgetThemeDropdown
          options={themeOptions}
          selectedValue={theme}
          onSelect={setTheme}
          accessibilityLabel={themeLabel}
          bottomSheetTitle={themeLabel}
          alreadyUsedLabel={alreadyUsedLabel}
        />
      </div>
    </div>
  )
}
