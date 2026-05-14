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
  recurringLabel: 'Recurring transaction',
}

afterEach(cleanup)

describe('TransactionFormContent', () => {
  it('renders all form fields', () => {
    render(<TransactionFormContent {...DEFAULT_PROPS} />)

    expect(screen.getByLabelText('Transaction Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
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
          recurring: true,
        }}
      />
    )

    expect(screen.getByLabelText('Transaction Name')).toHaveValue('Gym')
    expect(screen.getByLabelText('Amount')).toHaveValue('-50')
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('exposes getValues via ref', () => {
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
          date: '2026-01-15T00:00:00Z',
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
        date: '2026-01-15T00:00:00Z',
      })
    )
  })
})
