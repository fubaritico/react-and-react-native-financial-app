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

import { PotFormContent } from './PotFormContent.web'

import type { PotFormValues } from './PotFormContent'
import type { RefObject } from 'react'

afterEach(cleanup)

function getFormData(form: HTMLFormElement): PotFormValues {
  return JSON.parse(form.dataset.formData ?? '{}') as PotFormValues
}

const DEFAULT_PROPS = {
  nameLabel: 'Pot Name',
  namePlaceholder: 'e.g. Savings',
  targetLabel: 'Target',
  targetPlaceholder: 'e.g. 2000',
  themeLabel: 'Theme',
  charactersLeftLabel: (count: number) => `${String(count)} characters left`,
  alreadyUsedLabel: 'Already used',
}

describe('PotFormContent (web)', () => {
  describe('Rendering', () => {
    it('renders all form fields', () => {
      render(<PotFormContent {...DEFAULT_PROPS} />)

      expect(screen.getByLabelText('Pot Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Target')).toBeInTheDocument()
      expect(screen.getByText('Theme')).toBeInTheDocument()
    })

    it('renders description when provided', () => {
      render(
        <PotFormContent {...DEFAULT_PROPS} description="Set a savings goal." />
      )

      expect(screen.getByText('Set a savings goal.')).toBeInTheDocument()
    })

    it('does not render description when omitted', () => {
      render(<PotFormContent {...DEFAULT_PROPS} />)

      expect(screen.queryByText('Set a savings goal.')).not.toBeInTheDocument()
    })

    it('renders characters left counter with initial value of 30', () => {
      render(<PotFormContent {...DEFAULT_PROPS} />)

      expect(screen.getByText('30 characters left')).toBeInTheDocument()
    })
  })

  describe('Pre-fill', () => {
    it('pre-fills name and target from initialValues', () => {
      const initialValues: PotFormValues = {
        name: 'Holidays',
        target: '1500',
        theme: 'blue',
      }
      render(
        <PotFormContent {...DEFAULT_PROPS} initialValues={initialValues} />
      )

      expect(screen.getByLabelText('Pot Name')).toHaveValue('Holidays')
      expect(screen.getByLabelText('Target')).toHaveValue('1500')
    })

    it('exposes initialValues via dataset', () => {
      const ref = { current: null } as RefObject<HTMLFormElement | null>
      const initialValues: PotFormValues = {
        name: 'Holidays',
        target: '1500',
        theme: 'blue',
      }
      render(
        <PotFormContent
          {...DEFAULT_PROPS}
          initialValues={initialValues}
          ref={ref}
        />
      )

      const data = getFormData(ref.current!)
      expect(data.name).toBe('Holidays')
      expect(data.target).toBe('1500')
      expect(data.theme).toBe('blue')
    })
  })

  describe('User interaction', () => {
    it('updates name field on user input', async () => {
      const user = userEvent.setup()
      render(<PotFormContent {...DEFAULT_PROPS} />)

      const nameInput = screen.getByLabelText('Pot Name')
      await user.type(nameInput, 'Vacation')

      expect(nameInput).toHaveValue('Vacation')
    })

    it('updates target field on user input', async () => {
      const user = userEvent.setup()
      render(<PotFormContent {...DEFAULT_PROPS} />)

      const targetInput = screen.getByLabelText('Target')
      await user.type(targetInput, '3000')

      expect(targetInput).toHaveValue('3000')
    })

    it('sanitizes non-numeric characters from target', async () => {
      const user = userEvent.setup()
      render(<PotFormContent {...DEFAULT_PROPS} />)

      const targetInput = screen.getByLabelText('Target')
      await user.type(targetInput, '50abc')

      expect(targetInput).toHaveValue('50')
    })

    it('updates characters left counter after typing name', async () => {
      const user = userEvent.setup()
      render(<PotFormContent {...DEFAULT_PROPS} />)

      const nameInput = screen.getByLabelText('Pot Name')
      await user.type(nameInput, 'Rainy')

      expect(screen.getByText('25 characters left')).toBeInTheDocument()
    })
  })

  describe('Dataset access', () => {
    it('exposes form data via dataset with all fields', () => {
      const ref = { current: null } as RefObject<HTMLFormElement | null>
      const initialValues: PotFormValues = {
        name: 'Emergency',
        target: '500',
        theme: 'red',
      }
      render(
        <PotFormContent
          {...DEFAULT_PROPS}
          initialValues={initialValues}
          ref={ref}
        />
      )

      const data = getFormData(ref.current!)
      expect(data.name).toBe('Emergency')
      expect(data.target).toBe('500')
      expect(data.theme).toBe('red')
    })

    it('data-error is "true" for empty default form', async () => {
      const ref = { current: null } as RefObject<HTMLFormElement | null>
      render(<PotFormContent {...DEFAULT_PROPS} ref={ref} />)

      await waitFor(() => {
        expect(ref.current!.dataset.error).toBe('true')
      })
    })

    it('data-error is "false" when all fields are valid', async () => {
      const ref = { current: null } as RefObject<HTMLFormElement | null>
      const user = userEvent.setup()
      render(<PotFormContent {...DEFAULT_PROPS} ref={ref} />)

      await user.type(screen.getByLabelText('Pot Name'), 'Savings')
      await user.type(screen.getByLabelText('Target'), '1000')

      await waitFor(() => {
        expect(ref.current!.dataset.error).toBe('false')
      })
    })
  })

  describe('Validation', () => {
    it('shows name error after touching and clearing field', async () => {
      const user = userEvent.setup()
      render(<PotFormContent {...DEFAULT_PROPS} />)

      const nameInput = screen.getByLabelText('Pot Name')
      await user.type(nameInput, 'x')
      await user.clear(nameInput)

      await waitFor(() => {
        expect(screen.getByText('validation.nameRequired')).toBeInTheDocument()
      })
    })

    it('shows target error after touching and clearing field', async () => {
      const user = userEvent.setup()
      render(<PotFormContent {...DEFAULT_PROPS} />)

      const targetInput = screen.getByLabelText('Target')
      await user.type(targetInput, '1')
      await user.type(targetInput, '{Backspace}')

      await waitFor(() => {
        expect(
          screen.getByText('validation.targetRequired')
        ).toBeInTheDocument()
      })
    })
  })
})
