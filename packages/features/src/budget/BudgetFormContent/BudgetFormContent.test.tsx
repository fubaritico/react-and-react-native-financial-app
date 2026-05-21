/* eslint-disable @typescript-eslint/no-non-null-assertion -- refs are always set after render */
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}))

import { BudgetFormContent } from './BudgetFormContent.web'

import type { BudgetFormValues } from './BudgetFormContent'
import type { RefObject } from 'react'

afterEach(cleanup)

function getFormData(form: HTMLFormElement): BudgetFormValues {
  return JSON.parse(form.dataset.formData ?? '{}') as BudgetFormValues
}

const DEFAULT_PROPS = {
  categoryLabel: 'Category',
  maximumLabel: 'Maximum Spend',
  themeLabel: 'Theme',
  maximumPlaceholder: 'e.g. 2000',
  alreadyUsedLabel: 'Already used',
}

describe('BudgetFormContent (web)', () => {
  describe('Rendering', () => {
    it('renders all form fields', () => {
      render(<BudgetFormContent {...DEFAULT_PROPS} />)

      expect(screen.getByText('Category')).toBeInTheDocument()
      expect(screen.getByLabelText('Maximum Spend')).toBeInTheDocument()
      expect(screen.getByText('Theme')).toBeInTheDocument()
    })

    it('renders description when provided', () => {
      render(
        <BudgetFormContent
          {...DEFAULT_PROPS}
          description="Set your monthly budget cap."
        />
      )

      expect(
        screen.getByText('Set your monthly budget cap.')
      ).toBeInTheDocument()
    })

    it('does not render description when omitted', () => {
      render(<BudgetFormContent {...DEFAULT_PROPS} />)

      expect(
        screen.queryByText('Set your monthly budget cap.')
      ).not.toBeInTheDocument()
    })
  })

  describe('Pre-fill', () => {
    it('pre-fills maximum from initialValues', () => {
      const initialValues: BudgetFormValues = {
        category: 'Bills',
        maximum: '500',
        theme: 'blue',
      }

      render(
        <BudgetFormContent {...DEFAULT_PROPS} initialValues={initialValues} />
      )

      expect(screen.getByLabelText('Maximum Spend')).toHaveValue('500')
    })

    it('exposes initialValues via dataset', () => {
      const ref = { current: null } as RefObject<HTMLFormElement | null>
      const initialValues: BudgetFormValues = {
        category: 'Bills',
        maximum: '500',
        theme: 'blue',
      }

      render(
        <BudgetFormContent
          {...DEFAULT_PROPS}
          initialValues={initialValues}
          ref={ref}
        />
      )

      const formData = getFormData(ref.current!)
      expect(formData.category).toBe('Bills')
      expect(formData.maximum).toBe('500')
      expect(formData.theme).toBe('blue')
    })
  })

  describe('User interaction', () => {
    it('updates maximum field on user input', async () => {
      const user = userEvent.setup()

      render(<BudgetFormContent {...DEFAULT_PROPS} />)

      const input = screen.getByLabelText('Maximum Spend')
      await user.clear(input)
      await user.type(input, '750')

      expect(input).toHaveValue('750')
    })

    it('sanitizes non-numeric characters from maximum input', async () => {
      const user = userEvent.setup()

      render(<BudgetFormContent {...DEFAULT_PROPS} />)

      const input = screen.getByLabelText('Maximum Spend')
      await user.clear(input)
      await user.type(input, '12ab34')

      expect(input).toHaveValue('1234')
    })
  })

  describe('Dataset access', () => {
    it('exposes form data via dataset with all fields', async () => {
      const user = userEvent.setup()
      const ref = { current: null } as RefObject<HTMLFormElement | null>

      render(<BudgetFormContent {...DEFAULT_PROPS} ref={ref} />)

      const input = screen.getByLabelText('Maximum Spend')
      await user.clear(input)
      await user.type(input, '300')

      const formData = getFormData(ref.current!)
      expect(formData).toHaveProperty('category')
      expect(formData).toHaveProperty('maximum')
      expect(formData).toHaveProperty('theme')
      expect(formData.maximum).toBe('300')
    })

    it('data-error is "true" for invalid default form (maximum is empty)', async () => {
      const ref = { current: null } as RefObject<HTMLFormElement | null>

      render(<BudgetFormContent {...DEFAULT_PROPS} ref={ref} />)

      await waitFor(() => {
        expect(ref.current!.dataset.error).toBe('true')
      })
    })

    it('data-error is "false" when all fields are valid', async () => {
      const user = userEvent.setup()
      const ref = { current: null } as RefObject<HTMLFormElement | null>

      render(
        <BudgetFormContent
          {...DEFAULT_PROPS}
          initialValues={{
            category: 'Entertainment',
            maximum: '',
            theme: 'green',
          }}
          ref={ref}
        />
      )

      const input = screen.getByLabelText('Maximum Spend')
      await user.clear(input)
      await user.type(input, '200')

      await waitFor(() => {
        expect(ref.current!.dataset.error).toBe('false')
      })
    })
  })

  describe('Validation', () => {
    it('shows maximum error after touching and clearing field', async () => {
      const user = userEvent.setup()
      render(<BudgetFormContent {...DEFAULT_PROPS} />)

      const input = screen.getByLabelText('Maximum Spend')
      await user.type(input, '1')
      await user.type(input, '{Backspace}')

      await waitFor(() => {
        expect(
          screen.getByText('validation.maximumRequired')
        ).toBeInTheDocument()
      })
    })
  })
})
