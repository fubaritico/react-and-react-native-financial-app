import { Dropdown, TextInput, Typography, tw } from '@financial-app/ui/native'
import { useImperativeHandle, useMemo, useState } from 'react'
import { View } from 'react-native'

import { BudgetThemeDropdown } from '../BudgetThemeDropdown/BudgetThemeDropdown.native'

import {
  BUDGET_CATEGORIES,
  DEFAULT_BUDGET_FORM,
  THEME_COLORS,
} from './BudgetFormContent.constants'

import type { IBudgetFormContentProps } from './BudgetFormContent'

/**
 * BudgetFormContent — form body for Add/Edit budget modals (native).
 * Manages its own local state and exposes values via ref.
 */
export function BudgetFormContent({
  initialValues,
  existingCategories = [],
  existingThemes = [],
  categoryLabel = 'Budget Category',
  maximumLabel = 'Maximum Spend',
  themeLabel = 'Theme',
  maximumPlaceholder = 'e.g. 2000',
  alreadyUsedLabel = 'Already used',
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
          selectedValue={category}
          onSelect={setCategory}
          accessibilityLabel={categoryLabel}
          bottomSheetTitle={categoryLabel}
          withPortal
        />
      </View>

      {/* Maximum Spend */}
      <View style={tw`gap-1`}>
        <TextInput
          label={maximumLabel}
          value={maximum}
          onChangeText={setMaximum}
          prefix="$"
          placeholder={maximumPlaceholder}
          keyboardType="numeric"
          accessibilityLabel={maximumLabel}
        />
      </View>

      {/* Theme */}
      <View style={tw`gap-1`}>
        <Typography variant="body-bold" color="foreground">
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
      </View>
    </View>
  )
}
