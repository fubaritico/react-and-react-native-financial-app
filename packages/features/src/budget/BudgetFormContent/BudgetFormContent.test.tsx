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

/** Mock categories for the dropdown */
const MOCK_CATEGORIES = [
  {
    id: 'cat-001',
    name: 'Entertainment',
    icon: 'categoryEntertainment' as const,
    color: 'red',
    is_system: true,
  },
  {
    id: 'cat-002',
    name: 'Bills',
    icon: 'categoryBills' as const,
    color: 'blue',
    is_system: true,
  },
  {
    id: 'cat-003',
    name: 'Groceries',
    icon: 'categoryGroceries' as const,
    color: 'army-green',
    is_system: true,
  },
]

const DEFAULT_PROPS = {
  categories: MOCK_CATEGORIES,
  categoryLabel: 'Category',
  maximumLabel: 'Maximum Spend',
  maximumPlaceholder: 'e.g. 2000',
}

describe('BudgetFormContent (web)', () => {
  describe('Rendering', () => {
    it('renders all form fields', () => {
      render(<BudgetFormContent {...DEFAULT_PROPS} />)

      expect(screen.getByText('Category')).toBeInTheDocument()
      expect(screen.getByLabelText('Maximum Spend')).toBeInTheDocument()
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
        category_id: 'cat-002',
        maximum: '500',
      }

      render(
        <BudgetFormContent {...DEFAULT_PROPS} initialValues={initialValues} />
      )

      expect(screen.getByLabelText('Maximum Spend')).toHaveValue('500')
    })

    it('exposes initialValues via dataset', () => {
      const ref = { current: null } as RefObject<HTMLFormElement | null>
      const initialValues: BudgetFormValues = {
        category_id: 'cat-002',
        maximum: '500',
      }

      render(
        <BudgetFormContent
          {...DEFAULT_PROPS}
          initialValues={initialValues}
          ref={ref}
        />
      )

      const formData = getFormData(ref.current!)
      expect(formData.category_id).toBe('cat-002')
      expect(formData.maximum).toBe('500')
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
      expect(formData).toHaveProperty('category_id')
      expect(formData).toHaveProperty('maximum')
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
            category_id: 'cat-001',
            maximum: '',
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
