import { useFormValidation } from '@financial-app/shared'
import { TextInput, Typography, tw } from '@financial-app/ui/native'
import { useCallback, useImperativeHandle, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ThemeColorDropdown } from '../ThemeColorDropdown/ThemeColorDropdown.native'

import {
  DEFAULT_POT_FORM,
  POT_NAME_MAX_LENGTH,
  THEME_COLORS,
  createPotFormSchema,
} from './PotFormContent.constants'

import type {
  IPotFormContentProps,
  IPotFormRef,
  PotFormValues,
} from './PotFormContent'
import type { Ref } from 'react'

/** Native-specific props — adds imperative ref handle */
interface IPotFormNativeProps extends IPotFormContentProps {
  /** Ref exposing getValues() and hasErrors for the route submit handler */
  ref?: Ref<IPotFormRef>
}

/**
 * PotFormContent — form body for Add/Edit pot modals (native).
 * Uses useFormValidation for state + Zod validation, exposes values via ref.
 *
 * @param props - Form props including labels, initial values, and ref
 * @returns Form body JSX for the modal
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
}: Readonly<IPotFormNativeProps>) {
  const { t } = useTranslation()

  /** Zod schema with translated error messages */
  const schema = useMemo(() => createPotFormSchema(t), [t])

  /** Responsible for form state and validation */
  const { formData, errors, validateField, validateForm, hasErrors } =
    useFormValidation<PotFormValues>(schema, initialValues ?? DEFAULT_POT_FORM)

  /** @param value - New name value */
  const onNameChange = useCallback(
    (value: string) => {
      validateField('name', value)
    },
    [validateField]
  )

  /** @param value - New target value as string */
  const onTargetChange = useCallback(
    (value: string) => {
      const sanitized = value.replace(/[^0-9.]/g, '')
      validateField('target', sanitized)
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

  /** Characters remaining for pot name */
  const charsLeft = POT_NAME_MAX_LENGTH - formData.name.length

  /** Theme colors (no filtering — pots can share themes) */

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
          value={formData.name}
          onChangeText={onNameChange}
          placeholder={namePlaceholder}
          maxLength={POT_NAME_MAX_LENGTH}
          accessibilityLabel={nameLabel}
          error={!!errors.name}
          helperText={errors.name}
        />
        <Typography variant="caption" color="muted" style={tw`text-right`}>
          {charactersLeftLabel(charsLeft)}
        </Typography>
      </View>

      {/* Target */}
      <View style={tw`gap-1`}>
        <TextInput
          label={targetLabel}
          value={formData.target}
          onChangeText={onTargetChange}
          prefix="$"
          placeholder={targetPlaceholder}
          keyboardType="numeric"
          accessibilityLabel={targetLabel}
          error={!!errors.target}
          helperText={errors.target}
        />
      </View>

      {/* Theme */}
      <View style={tw`gap-1`}>
        <Typography variant="body-bold" color="foreground">
          {themeLabel}
        </Typography>
        <ThemeColorDropdown
          options={THEME_COLORS}
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
