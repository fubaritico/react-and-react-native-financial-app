import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { TransactionFormContent } from './TransactionFormContent.web'

import type { ITransactionFormRef } from './TransactionFormContent'
import type { RefObject } from 'react'

const DEFAULT_PROPS = {
  nameLabel: 'Transaction Name',
  namePlaceholder: 'e.g. Urban Sports Club',
  amountLabel: 'Amount',
  amountPlaceholder: 'e.g. 45.00',
  categoryLabel: 'Category',
  dateLabel: 'Date',
  datePlaceholder: 'Select date',
  recurringLabel: 'Recurring transaction',
}

afterEach(cleanup)

describe('TransactionFormContent', () => {
  it('renders all form fields', () => {
    render(<TransactionFormContent {...DEFAULT_PROPS} />)

    expect(screen.getByLabelText('Transaction Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Recurring transaction')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <TransactionFormContent
        {...DEFAULT_PROPS}
        description="Create a new transaction."
      />
    )

    expect(screen.getByText('Create a new transaction.')).toBeInTheDocument()
  })

  it('does not render description when omitted', () => {
    render(<TransactionFormContent {...DEFAULT_PROPS} />)

    expect(
      screen.queryByText('Create a new transaction.')
    ).not.toBeInTheDocument()
  })

  it('updates name field on user input', async () => {
    const user = userEvent.setup()
    render(<TransactionFormContent {...DEFAULT_PROPS} />)

    const nameInput = screen.getByLabelText('Transaction Name')
    await user.clear(nameInput)
    await user.type(nameInput, 'Netflix')

    expect(nameInput).toHaveValue('Netflix')
  })

  it('updates amount field on user input', async () => {
    const user = userEvent.setup()
    render(<TransactionFormContent {...DEFAULT_PROPS} />)

    const amountInput = screen.getByLabelText('Amount')
    await user.clear(amountInput)
    await user.type(amountInput, '99.50')

    expect(amountInput).toHaveValue('99.50')
  })

  it('toggles recurring checkbox', async () => {
    const user = userEvent.setup()
    render(<TransactionFormContent {...DEFAULT_PROPS} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('pre-fills fields from initialValues', () => {
    render(
      <TransactionFormContent
        {...DEFAULT_PROPS}
        initialValues={{
          name: 'Gym',
          amount: -50,
          category: 'Lifestyle',
          date: '2026-03-20',
          recurring: true,
        }}
      />
    )

    expect(screen.getByLabelText('Transaction Name')).toHaveValue('Gym')
    expect(screen.getByLabelText('Amount')).toHaveValue('-50')
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('exposes getValues via ref with date', () => {
    const ref = { current: null } as RefObject<ITransactionFormRef | null>

    render(
      <TransactionFormContent
        {...DEFAULT_PROPS}
        ref={ref}
        initialValues={{
          name: 'Rent',
          amount: -1200,
          category: 'Bills',
          recurring: true,
          date: '2026-01-15',
        }}
      />
    )

    const values = ref.current?.getValues()
    expect(values).toEqual(
      expect.objectContaining({
        name: 'Rent',
        amount: -1200,
        category: 'Bills',
        recurring: true,
        date: '2026-01-15',
      })
    )
  })

  it('defaults date to today when no initialValues.date', () => {
    const ref = { current: null } as RefObject<ITransactionFormRef | null>

    render(<TransactionFormContent {...DEFAULT_PROPS} ref={ref} />)

    const values = ref.current?.getValues()
    // Date should be a YYYY-MM-DD string matching today
    expect(values?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('renders DatePicker label', () => {
    render(<TransactionFormContent {...DEFAULT_PROPS} />)

    expect(screen.getByText('Date')).toBeInTheDocument()
  })

  it('renders DatePicker with pre-filled date from initialValues', () => {
    const ref = { current: null } as RefObject<ITransactionFormRef | null>

    render(
      <TransactionFormContent
        {...DEFAULT_PROPS}
        ref={ref}
        initialValues={{ date: '2026-07-04' }}
      />
    )

    const values = ref.current?.getValues()
    expect(values?.date).toBe('2026-07-04')
  })

  it('returns updated date in getValues after re-render with new initialValues', () => {
    const ref = { current: null } as RefObject<ITransactionFormRef | null>

    const { rerender } = render(
      <TransactionFormContent
        {...DEFAULT_PROPS}
        ref={ref}
        initialValues={{ date: '2026-01-01' }}
      />
    )

    expect(ref.current?.getValues().date).toBe('2026-01-01')

    // Re-render with a different date (simulates edit mode switching)
    rerender(
      <TransactionFormContent
        {...DEFAULT_PROPS}
        ref={ref}
        initialValues={{ date: '2026-06-15' }}
      />
    )

    // useState initializes once — rerender doesn't reset state
    expect(ref.current?.getValues().date).toBe('2026-01-01')
  })

  it('includes all fields in getValues including date', () => {
    const ref = { current: null } as RefObject<ITransactionFormRef | null>

    render(
      <TransactionFormContent
        {...DEFAULT_PROPS}
        ref={ref}
        initialValues={{
          name: 'Groceries run',
          amount: -85.5,
          category: 'Groceries',
          date: '2026-05-14',
          recurring: false,
        }}
      />
    )

    const values = ref.current?.getValues()
    expect(values).toEqual({
      name: 'Groceries run',
      amount: -85.5,
      category: 'Groceries',
      date: '2026-05-14',
      recurring: false,
    })
  })
})
