import { z } from 'zod'

import type { IDropdownOption } from '@financial-app/ui'

/** Maximum number of characters for a pot name */
export const POT_NAME_MAX_LENGTH = 30

/** All available theme colors (token names matching design system) */
export const THEME_COLORS: IDropdownOption[] = [
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'navy', label: 'Navy' },
  { value: 'red', label: 'Red' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'turquoise', label: 'Turquoise' },
  { value: 'brown', label: 'Brown' },
  { value: 'magenta', label: 'Magenta' },
  { value: 'blue', label: 'Blue' },
  { value: 'navy-grey', label: 'Navy Grey' },
  { value: 'army-green', label: 'Army Green' },
  { value: 'gold', label: 'Gold' },
  { value: 'orange', label: 'Orange' },
]

/**
 * Creates a Zod schema for pot form validation with i18n messages.
 * @param t - Translation function
 * @returns Zod schema for PotFormValues
 */
export const createPotFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    target: z
      .string()
      .min(1, t('validation.targetRequired'))
      .refine(
        (v) =>
          v.length === 0 ||
          (v !== '.' && !Number.isNaN(Number(v)) && Number(v) > 0),
        t('validation.targetInvalid')
      ),
    theme: z.string().min(1, t('validation.themeRequired')),
  })

/** Default form values for the Add Pot form */
export const DEFAULT_POT_FORM = {
  name: '',
  target: '',
  theme: 'green',
} as const
