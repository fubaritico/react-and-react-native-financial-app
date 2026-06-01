import { useCallback } from 'react'

import type { RefObject } from 'react'

/** Imperative accessor between a web form (DOM dataset pattern) and the CRUD modal hooks. */
export interface IFormAccessor<T> {
  /**
   * Reads and clears the serialized form data stashed on the form's dataset.
   * @returns The parsed form values, or null if none are present
   */
  getFormData: () => T | null
  /**
   * Reports whether the form currently flags a validation error.
   * @returns True when the form's `data-error` dataset flag is `'true'`
   */
  hasErrors: () => boolean
  /**
   * Triggers the browser's native form validation display.
   * @returns void — calls requestSubmit() as a side effect
   */
  triggerValidation: () => void
}

/**
 * Connects a web form element to the CRUD modal hooks via the DOM dataset pattern.
 * Deduplicates the getFormData / hasErrors / triggerValidation trio previously
 * copy-pasted across the transactions, budgets, and pots routes.
 * @param formRef - Ref to the rendered HTMLFormElement
 * @returns The form accessor callbacks
 */
export function useFormAccessor<T>(
  formRef: RefObject<HTMLFormElement | null>
): IFormAccessor<T> {
  const getFormData = useCallback((): T | null => {
    const ref = formRef.current
    if (!ref?.dataset.formData) return null
    const data = structuredClone(JSON.parse(ref.dataset.formData) as T)
    delete ref.dataset.formData
    return data
  }, [formRef])

  const hasErrors = useCallback(
    () => formRef.current?.dataset.error === 'true',
    [formRef]
  )

  const triggerValidation = useCallback(() => {
    formRef.current?.requestSubmit()
  }, [formRef])

  return { getFormData, hasErrors, triggerValidation }
}
