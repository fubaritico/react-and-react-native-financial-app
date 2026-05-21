import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'

/**
 * Validation errors — key = field name, value = error message
 */
type ValidationErrors = Record<string, string>

/**
 * Custom form validation hook powered by Zod.
 * Provides progressive validation (field by field), full validation,
 * and automatic form change tracking.
 *
 * @template T - Form data type
 *
 * @param schema - Zod schema for validation
 * @param initialValues - Initial form data
 *
 * @returns Object containing validation functions and state
 */
export const useFormValidation = <T extends object>(
  schema: z.ZodSchema<T>,
  initialValues: T
) => {
  // Form state
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [hasErrors, setHasErrors] = useState(false)
  const [formData, setFormData] = useState<T>(initialValues)

  /**
   * Frozen copy of initial data (first value of formData, never changes)
   */
  const initialFormData = useRef<T | null>(null)
  const hasValidatedOnMount = useRef(false)

  /**
   * Copy only on first render
   */

  initialFormData.current ??= structuredClone(formData)

  /**
   * Automatically compute whether the form has changed
   */
  const hasFormChanged = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialFormData.current),
    [formData]
  )

  /**
   * Silent validation on mount to set hasErrors only
   */
  useEffect(() => {
    if (!hasValidatedOnMount.current) {
      try {
        schema.parse(formData)
        setHasErrors(false)
      } catch {
        setHasErrors(true)
      }
      hasValidatedOnMount.current = true
    }
  }, [schema, formData, setHasErrors])

  /**
   * Validates a specific form field.
   * Only displays errors for fields already "touched" by the user.
   *
   * @param fieldName - Name of the field to validate
   * @param value - New value of the field
   *
   * @returns true if the field is valid, false otherwise
   */
  const validateField = useCallback(
    (fieldName: keyof T, value: unknown) => {
      // Mark the field as "touched"
      setTouchedFields((prev) => new Set(prev).add(fieldName as string))
      // Create a copy of the data with the new value
      const updatedData = { ...formData, [fieldName]: value }
      // Update form data
      setFormData(updatedData)

      try {
        // Validate the entire form for full context
        schema.parse(updatedData)
        // If valid, remove the error for this field
        setErrors((prev) => {
          const { [fieldName as string]: _, ...rest } = prev
          setHasErrors(Object.keys(rest).length > 0)
          return rest
        })

        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Only process errors for already-touched fields
          setErrors((prev) => {
            const { [fieldName as string]: _, ...newErrors } = prev
            // Add new errors only for touched fields
            error.errors.forEach((err) => {
              const errorFieldName = err.path[0] as string

              if (
                touchedFields.has(errorFieldName) ||
                errorFieldName === fieldName
              ) {
                newErrors[errorFieldName] = err.message
              }
            })

            // Update hasErrors after modifying errors
            setHasErrors(true)

            return newErrors
          })

          // Return true if this specific field has no error
          const fieldError = error.errors.find(
            (err) => err.path[0] === fieldName
          )

          return !fieldError
        }
      }

      return false
    },
    [formData, schema, touchedFields]
  )

  /**
   * Validates the form silently (without displaying errors).
   * Used to check validity without impacting the UI.
   *
   * @param formData - Complete form data to validate
   *
   * @returns true if the form is valid, false otherwise
   */
  const validateFormSilently = useCallback(
    (formData: T) => {
      try {
        schema.parse(formData)

        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          return false
        }
      }

      return false
    },
    [schema]
  )

  /**
   * Validates the entire form and displays all errors.
   * Used on submission or full validation.
   *
   * @param formData - Complete form data to validate
   *
   * @returns true if the form is valid, false otherwise
   */
  const validateForm = useCallback(
    (formData: T) => {
      try {
        schema.parse(formData)
        setErrors({})
        setHasErrors(false)

        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: ValidationErrors = {}

          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as string] = err.message
            }
          })
          setErrors(newErrors)
          setHasErrors(true)

          return false
        }
      }

      return false
    },
    [schema]
  )

  /**
   * Clears all validation errors
   */
  const clearErrors = useCallback(() => {
    setErrors({})
    setHasErrors(false)
  }, [])

  /**
   * Resets the list of touched fields.
   * Useful when resetting the form.
   */
  const resetTouchedFields = useCallback(() => {
    setTouchedFields(new Set())
  }, [])

  return {
    /** Current errors object (key = field name, value = message) */
    errors,
    /** Validates a specific field (progressive validation) */
    validateField,
    /** Validates the entire form and displays errors */
    validateForm,
    /** Validates the entire form without displaying errors */
    validateFormSilently,
    /** Clears all validation errors */
    clearErrors,
    /** Resets the list of touched fields */
    resetTouchedFields,
    /** Whether the form currently has validation errors */
    hasErrors,
    /** Whether the form has changed from its initial values */
    hasFormChanged,
    /** Current form data state */
    formData,
  }
}
