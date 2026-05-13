import { TextInput, Typography } from '@financial-app/ui'
import { useImperativeHandle, useState } from 'react'

import { THEME_COLORS } from '../../budget/BudgetFormContent/BudgetFormContent.constants'
import { BudgetThemeDropdown } from '../../budget/BudgetThemeDropdown/BudgetThemeDropdown.web'

import {
  DEFAULT_POT_FORM,
  POT_NAME_MAX_LENGTH,
} from './PotFormContent.constants'

import type { IPotFormContentProps } from './PotFormContent'

/**
 * PotFormContent — form body for Add/Edit pot modals (web).
 * Manages its own local state and exposes values via ref.
 */
export function PotFormContent({
  initialValues,
  nameLabel = 'Pot Name',
  namePlaceholder = 'e.g. Rainy Days',
  targetLabel = 'Target',
  targetPlaceholder = 'e.g. 2000',
  themeLabel = 'Theme',
  charactersLeftLabel = (count: number) => `${String(count)} characters left`,
  description,
  ref,
}: Readonly<IPotFormContentProps>) {
  const [name, setName] = useState(initialValues?.name ?? DEFAULT_POT_FORM.name)
  const [target, setTarget] = useState(
    initialValues?.target ?? DEFAULT_POT_FORM.target
  )
  const [theme, setTheme] = useState(
    initialValues?.theme ?? DEFAULT_POT_FORM.theme
  )

  useImperativeHandle(
    ref,
    () => ({ getValues: () => ({ name, target, theme }) }),
    [name, target, theme]
  )

  /** Characters remaining for pot name */
  const charsLeft = POT_NAME_MAX_LENGTH - name.length

  /** Theme options (no filtering — pots can share themes) */
  const themeOptions = THEME_COLORS

  return (
    <div className="flex flex-col gap-4">
      {description && (
        <Typography variant="body" color="muted">
          {description}
        </Typography>
      )}
      {/* Pot Name */}
      <div className="flex flex-col gap-1">
        <TextInput
          label={nameLabel}
          value={name}
          onChangeText={setName}
          placeholder={namePlaceholder}
          maxLength={POT_NAME_MAX_LENGTH}
          accessibilityLabel={nameLabel}
        />
        <Typography variant="caption" color="muted" className="text-right">
          {charactersLeftLabel(charsLeft)}
        </Typography>
      </div>

      {/* Target */}
      <div className="flex flex-col gap-1">
        <TextInput
          label={targetLabel}
          value={target}
          onChangeText={setTarget}
          prefix="$"
          placeholder={targetPlaceholder}
          keyboardType="numeric"
          accessibilityLabel={targetLabel}
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
        />
      </div>
    </div>
  )
}
