import { z } from 'zod'

import type { ZodIssue } from 'zod'

/** Zod schema for login form validation */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.validation.emailRequired')
    .email('auth.validation.emailInvalid'),
  password: z.string().min(1, 'auth.validation.passwordRequired'),
})

/** Zod schema for signup form validation */
export const signupSchema = z
  .object({
    name: z.string().min(1, 'auth.validation.nameRequired'),
    email: z
      .string()
      .min(1, 'auth.validation.emailRequired')
      .email('auth.validation.emailInvalid'),
    password: z
      .string()
      .min(1, 'auth.validation.passwordRequired')
      .min(8, 'auth.validation.passwordMin'),
    confirmPassword: z
      .string()
      .min(1, 'auth.validation.confirmPasswordRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.validation.passwordMismatch',
    path: ['confirmPassword'],
  })

/**
 * Extracts per-field error messages from Zod issues, keeping only the first error per field.
 * @param issues - Zod validation issues array
 * @param t - i18n translation function (message keys are stored in Zod schemas)
 * @returns Record mapping field names to translated error messages
 */
export function parseValidationErrors(
  issues: ZodIssue[],
  t: (key: string) => string
): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of issues) {
    const field = issue.path[0] as string
    if (!fieldErrors[field]) {
      fieldErrors[field] = t(issue.message)
    }
  }
  return fieldErrors
}

/** Inferred type for login form data */
export type LoginFormData = z.infer<typeof loginSchema>

/** Inferred type for signup form data */
export type SignupFormData = z.infer<typeof signupSchema>
