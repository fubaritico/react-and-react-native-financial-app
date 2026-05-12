import { resolveTokenColor } from '@financial-app/shared'
import {
  ColorDot,
  Dropdown,
  Icon,
  TextInput,
  Typography,
  tw,
} from '@financial-app/ui/native'
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { View } from 'react-native'

import {
  BUDGET_CATEGORIES,
  DEFAULT_BUDGET_FORM,
  THEME_COLORS,
} from './BudgetFormContent.constants'

import type {
  IBudgetFormContentProps,
  IBudgetFormRef,
} from './BudgetFormContent'

/**
 * BudgetFormContent — form body for Add/Edit budget modals (native).
 * Manages its own local state and exposes values via ref.
 */
export const BudgetFormContent = forwardRef<
  IBudgetFormRef,
  IBudgetFormContentProps
>(function BudgetFormContent(
  {
    initialValues,
    existingCategories = [],
    existingThemes = [],
    categoryLabel = 'Budget Category',
    maximumLabel = 'Maximum Spend',
    themeLabel = 'Theme',
    maximumPlaceholder = 'e.g. 2000',
  },
  ref
) {
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

  /** Custom trigger for the theme dropdown — ColorDot + label + caret */
  const renderThemeTrigger = useCallback(
    ({ selectedLabel }: { isOpen: boolean; selectedLabel: string }) => (
      <View style={tw`flex-row items-center gap-3 flex-1`}>
        <ColorDot color={resolveTokenColor(theme)} />
        <Typography variant="body" style={tw`flex-1`}>
          {selectedLabel}
        </Typography>
        <Icon
          name="caretDown"
          iconSize="xs"
          color={tw.color('foreground') ?? '#201F24'}
        />
      </View>
    ),
    [theme]
  )

  return (
    <View style={tw`gap-4`}>
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
        <Dropdown
          options={themeOptions}
          selectedValue={theme}
          onSelect={setTheme}
          accessibilityLabel={themeLabel}
          bottomSheetTitle={themeLabel}
          trigger={renderThemeTrigger}
        />
      </View>
    </View>
  )
})
