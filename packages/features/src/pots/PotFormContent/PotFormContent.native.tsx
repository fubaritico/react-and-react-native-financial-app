import { TextInput, Typography, tw } from '@financial-app/ui/native'
import { useImperativeHandle, useState } from 'react'
import { View } from 'react-native'

import { THEME_COLORS } from '../../budget/BudgetFormContent/BudgetFormContent.constants'
import { BudgetThemeDropdown } from '../../budget/BudgetThemeDropdown/BudgetThemeDropdown.native'

import {
  DEFAULT_POT_FORM,
  POT_NAME_MAX_LENGTH,
} from './PotFormContent.constants'

import type { IPotFormContentProps } from './PotFormContent'

/**
 * PotFormContent — form body for Add/Edit pot modals (native).
 * Manages its own local state and exposes values via ref.
 */
export function PotFormContent({
  initialValues,
  nameLabel,
  namePlaceholder,
  targetLabel,
  targetPlaceholder,
  themeLabel,
  charactersLeftLabel,
  alreadyUsedLabel,
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
    <View style={tw`gap-4`}>
      {description ? (
        <Typography variant="body" color="muted">
          {description}
        </Typography>
      ) : null}
      {/* Pot Name */}
      <View style={tw`gap-1`}>
        <TextInput
          label={nameLabel}
          value={name}
          onChangeText={setName}
          placeholder={namePlaceholder}
          maxLength={POT_NAME_MAX_LENGTH}
          accessibilityLabel={nameLabel}
        />
        <Typography variant="caption" color="muted" style={tw`text-right`}>
          {charactersLeftLabel(charsLeft)}
        </Typography>
      </View>

      {/* Target */}
      <View style={tw`gap-1`}>
        <TextInput
          label={targetLabel}
          value={target}
          onChangeText={setTarget}
          prefix="$"
          placeholder={targetPlaceholder}
          keyboardType="numeric"
          accessibilityLabel={targetLabel}
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
