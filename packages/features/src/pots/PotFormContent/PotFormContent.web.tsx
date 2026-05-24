import { useFormValidation } from '@financial-app/shared'
import { TextInput, Typography } from '@financial-app/ui'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ThemeColorDropdown } from '../ThemeColorDropdown/ThemeColorDropdown.web'

import {
  DEFAULT_POT_FORM,
  POT_NAME_MAX_LENGTH,
  THEME_COLORS,
  createPotFormSchema,
} from './PotFormContent.constants'

import type { IPotFormContentProps, PotFormValues } from './PotFormContent'
import type { FormEvent, Ref } from 'react'

/** Web-specific props — adds HTML form element ref */
interface IPotFormWebProps extends IPotFormContentProps {
  /** Ref to the underlying form element for dataset access */
  ref?: Ref<HTMLFormElement>
}

/**
 * PotFormContent — form body for Add/Edit pot modals (web).
 * Uses useFormValidation for state + Zod validation, exposes data via form dataset.
 *
 * @param props - Form props including labels, initial values, and ref
 * @returns Form body JSX for the modal
 */
export function PotFormContent({
  initialValues = DEFAULT_POT_FORM,
  nameLabel,
  namePlaceholder,
  targetLabel,
  targetPlaceholder,
  themeLabel,
  charactersLeftLabel,
  alreadyUsedLabel,
  description,
  ref,
}: Readonly<IPotFormWebProps>) {
  const { t } = useTranslation()

  /** Zod schema with translated error messages */
  const schema = useMemo(() => createPotFormSchema(t), [t])

  /** Responsible for form state and validation */
  const { formData, errors, validateField, hasErrors, validateForm } =
    useFormValidation<PotFormValues>(schema, initialValues)

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

  /** Handles form submission — prevents default and triggers full validation */
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      validateForm(formData)
    },
    [validateForm, formData]
  )

  /** Characters remaining for pot name */
  const charsLeft = POT_NAME_MAX_LENGTH - formData.name.length

  /** Theme colors (no filtering — pots can share themes) */

  return (
    <form
      id="pot-form"
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
        {/* Pot Name */}
        <div className="flex flex-col gap-1">
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
          <Typography variant="caption" color="muted" className="text-right">
            {charactersLeftLabel(charsLeft)}
          </Typography>
        </div>

        {/* Target */}
        <div className="flex flex-col gap-1">
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
        </div>

        {/* Theme */}
        <div className="flex flex-col gap-1">
          <Typography variant="label" color="muted">
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
        </div>
      </div>
    </form>
  )
}
