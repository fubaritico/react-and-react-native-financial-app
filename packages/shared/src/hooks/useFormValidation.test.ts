import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { useFormValidation } from './useFormValidation'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})
type FormData = z.infer<typeof schema>
const VALID: FormData = { name: 'John', email: 'john@test.com' }
const EMPTY: FormData = { name: '', email: '' }

describe('useFormValidation', () => {
  describe('Initial state', () => {
    it('formData equals initialValues', () => {
      const { result } = renderHook(() => useFormValidation(schema, VALID))
      expect(result.current.formData).toEqual(VALID)
    })

    it('errors is empty on mount (silent validation does NOT populate errors)', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      expect(result.current.errors).toEqual({})
    })

    it('hasErrors is true when initial data is invalid', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      expect(result.current.hasErrors).toBe(true)
    })

    it('hasErrors is false when initial data is valid', () => {
      const { result } = renderHook(() => useFormValidation(schema, VALID))
      expect(result.current.hasErrors).toBe(false)
    })

    it('hasFormChanged is false initially', () => {
      const { result } = renderHook(() => useFormValidation(schema, VALID))
      expect(result.current.hasFormChanged).toBe(false)
    })
  })

  describe('validateField', () => {
    it('updates formData for the field', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      act(() => {
        result.current.validateField('name', 'Alice')
      })
      expect(result.current.formData.name).toBe('Alice')
    })

    it('shows error for touched field with invalid value', () => {
      const { result } = renderHook(() => useFormValidation(schema, VALID))
      act(() => {
        result.current.validateField('email', 'not-an-email')
      })
      expect(result.current.errors.email).toBe('Invalid email')
    })

    it('clears error when field becomes valid', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      act(() => {
        result.current.validateField('email', 'bad')
      })
      expect(result.current.errors.email).toBe('Invalid email')
      act(() => {
        result.current.validateField('email', 'good@test.com')
      })
      expect(result.current.errors.email).toBeUndefined()
    })

    it('only shows errors for touched fields, not untouched', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      act(() => {
        result.current.validateField('name', '')
      })
      expect(result.current.errors.name).toBe('Name is required')
      expect(result.current.errors.email).toBeUndefined()
    })

    it('returns true when field is valid', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      let returnValue: boolean | undefined
      act(() => {
        returnValue = result.current.validateField('name', 'Alice')
      })
      expect(returnValue).toBe(true)
    })

    it('returns false when field is invalid', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      let returnValue: boolean | undefined
      act(() => {
        returnValue = result.current.validateField('name', '')
      })
      expect(returnValue).toBe(false)
    })

    it('updates hasErrors when a field becomes invalid', () => {
      const { result } = renderHook(() => useFormValidation(schema, VALID))
      act(() => {
        result.current.validateField('name', '')
      })
      expect(result.current.hasErrors).toBe(true)
    })

    it('updates hasErrors when all fields become valid', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      act(() => {
        result.current.validateField('name', 'Alice')
      })
      act(() => {
        result.current.validateField('email', 'alice@test.com')
      })
      expect(result.current.hasErrors).toBe(false)
    })
  })

  describe('validateForm', () => {
    it('shows ALL errors for ALL fields (even untouched)', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      act(() => {
        result.current.validateForm(EMPTY)
      })
      expect(result.current.errors.name).toBe('Name is required')
      expect(result.current.errors.email).toBe('Invalid email')
    })

    it('returns true for valid data', () => {
      const { result } = renderHook(() => useFormValidation(schema, VALID))
      let returnValue: boolean | undefined
      act(() => {
        returnValue = result.current.validateForm(VALID)
      })
      expect(returnValue).toBe(true)
    })

    it('returns false for invalid data', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      let returnValue: boolean | undefined
      act(() => {
        returnValue = result.current.validateForm(EMPTY)
      })
      expect(returnValue).toBe(false)
    })

    it('clears errors when called with valid data after previous errors', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      act(() => {
        result.current.validateForm(EMPTY)
      })
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0)
      act(() => {
        result.current.validateForm(VALID)
      })
      expect(result.current.errors).toEqual({})
    })
  })

  describe('validateFormSilently', () => {
    it('returns true for valid data', () => {
      const { result } = renderHook(() => useFormValidation(schema, VALID))
      let returnValue: boolean | undefined
      act(() => {
        returnValue = result.current.validateFormSilently(VALID)
      })
      expect(returnValue).toBe(true)
    })

    it('returns false for invalid data', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      let returnValue: boolean | undefined
      act(() => {
        returnValue = result.current.validateFormSilently(EMPTY)
      })
      expect(returnValue).toBe(false)
    })

    it('does NOT populate errors', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      act(() => {
        result.current.validateFormSilently(EMPTY)
      })
      expect(result.current.errors).toEqual({})
    })
  })

  describe('clearErrors', () => {
    it('resets errors to {} and hasErrors to false', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      act(() => {
        result.current.validateForm(EMPTY)
      })
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0)
      act(() => {
        result.current.clearErrors()
      })
      expect(result.current.errors).toEqual({})
      expect(result.current.hasErrors).toBe(false)
    })
  })

  describe('resetTouchedFields', () => {
    it('after reset, validateField on the same field still shows its error (field gets re-touched)', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      act(() => {
        result.current.validateField('name', '')
      })
      act(() => {
        result.current.resetTouchedFields()
      })
      act(() => {
        result.current.validateField('name', '')
      })
      expect(result.current.errors.name).toBe('Name is required')
    })

    it('after reset + clearErrors, untouched fields no longer show errors', () => {
      const { result } = renderHook(() => useFormValidation(schema, EMPTY))
      // Touch both fields so both have errors
      act(() => {
        result.current.validateField('name', '')
      })
      act(() => {
        result.current.validateField('email', 'bad')
      })
      expect(result.current.errors.email).toBe('Invalid email')
      // Reset touched fields AND clear existing errors
      act(() => {
        result.current.resetTouchedFields()
        result.current.clearErrors()
      })
      expect(result.current.errors).toEqual({})
      // Only touch 'name' — email should not resurface
      act(() => {
        result.current.validateField('name', 'x')
      })
      expect(result.current.errors.email).toBeUndefined()
    })
  })

  describe('hasFormChanged', () => {
    it('is false initially', () => {
      const { result } = renderHook(() => useFormValidation(schema, VALID))
      expect(result.current.hasFormChanged).toBe(false)
    })

    it('is true after validateField changes a value', () => {
      const { result } = renderHook(() => useFormValidation(schema, VALID))
      act(() => {
        result.current.validateField('name', 'Different')
      })
      expect(result.current.hasFormChanged).toBe(true)
    })

    it('is false again if value is set back to original', () => {
      const { result } = renderHook(() => useFormValidation(schema, VALID))
      act(() => {
        result.current.validateField('name', 'Different')
      })
      expect(result.current.hasFormChanged).toBe(true)
      act(() => {
        result.current.validateField('name', VALID.name)
      })
      expect(result.current.hasFormChanged).toBe(false)
    })
  })
})
