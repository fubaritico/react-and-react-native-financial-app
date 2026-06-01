import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { SegmentedControl } from './SegmentedControl.web'

import type { ISegmentOption } from './SegmentedControl'

afterEach(cleanup)

/** Two-segment fixture (the transaction type use case). */
const TWO_SEGMENTS: readonly ISegmentOption[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
]

/** Three-segment fixture to exercise middle (divider) segments. */
const THREE_SEGMENTS: readonly ISegmentOption[] = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

describe('SegmentedControl', () => {
  describe('happy path', () => {
    it('renders a radiogroup labelled by accessibilityLabel', () => {
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={vi.fn()}
          accessibilityLabel="Transaction type"
          name="txn-type"
        />
      )

      expect(
        screen.getByRole('radiogroup', { name: 'Transaction type' })
      ).toBeDefined()
    })

    it('renders one radio per segment', () => {
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={vi.fn()}
          accessibilityLabel="Transaction type"
          name="txn-type"
        />
      )

      expect(screen.getAllByRole('radio')).toHaveLength(2)
      expect(screen.getByRole('radio', { name: 'Expense' })).toBeDefined()
      expect(screen.getByRole('radio', { name: 'Income' })).toBeDefined()
    })

    it('marks the segment matching value as checked', () => {
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={vi.fn()}
          accessibilityLabel="Transaction type"
          name="txn-type"
        />
      )

      expect(screen.getByRole('radio', { name: 'Expense' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Income' })).not.toBeChecked()
    })

    it('calls onChange with the value of the clicked segment', async () => {
      const onChange = vi.fn()
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={onChange}
          accessibilityLabel="Transaction type"
          name="txn-type"
        />
      )

      await userEvent.click(screen.getByRole('radio', { name: 'Income' }))

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith('income')
    })
  })

  describe('variants', () => {
    it('reflects a different selected value', () => {
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="income"
          onChange={vi.fn()}
          accessibilityLabel="Transaction type"
          name="txn-type"
        />
      )

      expect(screen.getByRole('radio', { name: 'Income' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Expense' })).not.toBeChecked()
    })

    it('renders three segments and selects a middle one', async () => {
      const onChange = vi.fn()
      render(
        <SegmentedControl
          segments={THREE_SEGMENTS}
          value="all"
          onChange={onChange}
          accessibilityLabel="Filter"
          name="filter"
        />
      )

      expect(screen.getAllByRole('radio')).toHaveLength(3)
      await userEvent.click(screen.getByRole('radio', { name: 'Income' }))
      expect(onChange).toHaveBeenCalledWith('income')
    })

    it('associates every radio with the shared group name', () => {
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={vi.fn()}
          accessibilityLabel="Transaction type"
          name="txn-type"
        />
      )

      for (const radio of screen.getAllByRole('radio')) {
        expect(radio.getAttribute('name')).toBe('txn-type')
      }
    })

    it('renders the heading label when provided', () => {
      render(
        <SegmentedControl
          label="Transaction type"
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={vi.fn()}
          accessibilityLabel="Transaction type"
          name="txn-type"
        />
      )

      expect(screen.getByText('Transaction type')).toBeDefined()
    })

    it('renders no heading label when label is omitted', () => {
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={vi.fn()}
          accessibilityLabel="Transaction type"
          name="txn-type"
        />
      )

      expect(screen.queryByText('Transaction type')).toBeNull()
    })

    it('names the radiogroup from the visible label (aria-labelledby wins over accessibilityLabel)', () => {
      render(
        <SegmentedControl
          label="Visible heading"
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={vi.fn()}
          accessibilityLabel="Programmatic only"
          name="txn-type"
        />
      )

      expect(
        screen.getByRole('radiogroup', { name: 'Visible heading' })
      ).toBeDefined()
      expect(
        screen.queryByRole('radiogroup', { name: 'Programmatic only' })
      ).toBeNull()
    })
  })

  describe('managed errors', () => {
    it('disables every radio when disabled is set', () => {
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={vi.fn()}
          accessibilityLabel="Transaction type"
          name="txn-type"
          disabled
        />
      )

      for (const radio of screen.getAllByRole('radio')) {
        expect(radio).toBeDisabled()
      }
    })

    it('does not call onChange when disabled and clicked', async () => {
      const onChange = vi.fn()
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={onChange}
          accessibilityLabel="Transaction type"
          name="txn-type"
          disabled
        />
      )

      await userEvent.click(screen.getByRole('radio', { name: 'Income' }))

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  // L4: N/A — purely presentational, no async operations
  describe('unmanaged errors', () => {
    it('renders without crashing when onChange is a no-op', () => {
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={() => undefined}
          accessibilityLabel="Transaction type"
          name="txn-type"
        />
      )

      expect(screen.getAllByRole('radio')).toHaveLength(2)
    })
  })

  describe('edge cases', () => {
    it('does not fire onChange when the already-selected segment is clicked', async () => {
      const onChange = vi.fn()
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="expense"
          onChange={onChange}
          accessibilityLabel="Transaction type"
          name="txn-type"
        />
      )

      await userEvent.click(screen.getByRole('radio', { name: 'Expense' }))

      expect(onChange).not.toHaveBeenCalled()
    })

    it('renders when no segment matches the current value', () => {
      render(
        <SegmentedControl
          segments={TWO_SEGMENTS}
          value="unknown"
          onChange={vi.fn()}
          accessibilityLabel="Transaction type"
          name="txn-type"
        />
      )

      expect(screen.getByRole('radio', { name: 'Expense' })).not.toBeChecked()
      expect(screen.getByRole('radio', { name: 'Income' })).not.toBeChecked()
    })

    it('renders labels containing unicode and special characters', () => {
      const segments: readonly ISegmentOption[] = [
        { value: 'gain', label: 'Revenu €' },
        { value: 'loss', label: 'Dépense —' },
      ]
      render(
        <SegmentedControl
          segments={segments}
          value="gain"
          onChange={vi.fn()}
          accessibilityLabel="Type"
          name="type"
        />
      )

      expect(screen.getByRole('radio', { name: 'Revenu €' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Dépense —' })).not.toBeChecked()
    })
  })
})
