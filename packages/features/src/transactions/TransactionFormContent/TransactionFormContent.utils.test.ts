import { describe, expect, it } from 'vitest'

import { getTodayISO, toSignedAmount } from './TransactionFormContent.utils'

describe('TransactionFormContent.utils', () => {
  describe('getTodayISO', () => {
    describe('happy path', () => {
      it('returns a YYYY-MM-DD formatted string', () => {
        expect(getTodayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
    })
  })

  describe('toSignedAmount', () => {
    describe('happy path', () => {
      it('negates the amount for an expense', () => {
        expect(toSignedAmount('15.99', 'expense')).toBe(-15.99)
      })

      it('keeps the amount positive for an income', () => {
        expect(toSignedAmount('15.99', 'income')).toBe(15.99)
      })
    })

    describe('variants', () => {
      it('returns a whole negative number for an integer expense', () => {
        expect(toSignedAmount('2400', 'expense')).toBe(-2400)
      })

      it('returns a whole positive number for an integer income', () => {
        expect(toSignedAmount('2400', 'income')).toBe(2400)
      })

      it('treats an already-signed input as its absolute value', () => {
        expect(toSignedAmount('-50', 'income')).toBe(50)
        expect(toSignedAmount('-50', 'expense')).toBe(-50)
      })
    })

    describe('managed errors', () => {
      it('returns null for a zero amount', () => {
        expect(toSignedAmount('0', 'expense')).toBeNull()
        expect(toSignedAmount('0', 'income')).toBeNull()
      })

      it('returns null for a non-numeric string', () => {
        expect(toSignedAmount('abc', 'expense')).toBeNull()
      })
    })

    // L4: N/A — pure synchronous function with no external dependencies

    describe('edge cases', () => {
      it('returns null for an empty string', () => {
        expect(toSignedAmount('', 'expense')).toBeNull()
      })

      it('returns null for a lone decimal point', () => {
        expect(toSignedAmount('.', 'income')).toBeNull()
      })

      it('handles a leading decimal amount', () => {
        expect(toSignedAmount('.5', 'expense')).toBe(-0.5)
      })

      it('returns null for Infinity-producing input', () => {
        expect(toSignedAmount('1e400', 'expense')).toBeNull()
      })
    })
  })
})
