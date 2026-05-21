import { z } from 'zod'

/** Maximum number of characters for a pot name */
export const POT_NAME_MAX_LENGTH = 30

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
