import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { usePasswordRules } from './usePasswordRules'

describe('usePasswordRules', () => {
  it('returns all pristine when password is empty', () => {
    const { result } = renderHook(() => usePasswordRules('', ''))
    expect(result.current.allValid).toBe(false)
    for (const rule of result.current.rules) {
      expect(rule.state).toBe('pristine')
    }
  })

  it('returns 6 rules', () => {
    const { result } = renderHook(() => usePasswordRules('', ''))
    expect(result.current.rules).toHaveLength(6)
    expect(result.current.rules.map((r) => r.key)).toEqual([
      'minLength',
      'uppercase',
      'lowercase',
      'digit',
      'special',
      'match',
    ])
  })

  it('validates minLength rule (16+ chars)', () => {
    const { result, rerender } = renderHook(
      ({ pw }) => usePasswordRules(pw, ''),
      { initialProps: { pw: 'short' } }
    )
    expect(result.current.rules[0].state).toBe('pristine')

    rerender({ pw: 'abcdefghijklmnop' })
    expect(result.current.rules[0].state).toBe('valid')
  })

  it('validates uppercase rule', () => {
    const { result, rerender } = renderHook(
      ({ pw }) => usePasswordRules(pw, ''),
      { initialProps: { pw: 'abc' } }
    )
    expect(result.current.rules[1].state).toBe('pristine')

    rerender({ pw: 'Abc' })
    expect(result.current.rules[1].state).toBe('valid')
  })

  it('validates lowercase rule', () => {
    const { result, rerender } = renderHook(
      ({ pw }) => usePasswordRules(pw, ''),
      { initialProps: { pw: 'ABC' } }
    )
    expect(result.current.rules[2].state).toBe('pristine')

    rerender({ pw: 'ABc' })
    expect(result.current.rules[2].state).toBe('valid')
  })

  it('validates digit rule', () => {
    const { result, rerender } = renderHook(
      ({ pw }) => usePasswordRules(pw, ''),
      { initialProps: { pw: 'abc' } }
    )
    expect(result.current.rules[3].state).toBe('pristine')

    rerender({ pw: 'abc1' })
    expect(result.current.rules[3].state).toBe('valid')
  })

  it('validates special character rule', () => {
    const { result, rerender } = renderHook(
      ({ pw }) => usePasswordRules(pw, ''),
      { initialProps: { pw: 'abc' } }
    )
    expect(result.current.rules[4].state).toBe('pristine')

    rerender({ pw: 'abc$' })
    expect(result.current.rules[4].state).toBe('valid')
  })

  it('validates match rule', () => {
    const { result, rerender } = renderHook(
      ({ pw, cpw }) => usePasswordRules(pw, cpw),
      { initialProps: { pw: 'abc', cpw: '' } }
    )
    expect(result.current.rules[5].state).toBe('pristine')

    rerender({ pw: 'abc', cpw: 'abc' })
    expect(result.current.rules[5].state).toBe('valid')
  })

  it('match rule stays pristine when both empty', () => {
    const { result } = renderHook(() => usePasswordRules('', ''))
    expect(result.current.rules[5].state).toBe('pristine')
  })

  it('transitions to invalid when rule was valid then fails', () => {
    const { result, rerender } = renderHook(
      ({ pw }) => usePasswordRules(pw, ''),
      { initialProps: { pw: 'Abc' } }
    )
    // Uppercase is valid
    expect(result.current.rules[1].state).toBe('valid')

    // Remove uppercase — should go to invalid (was valid once)
    rerender({ pw: 'abc' })
    expect(result.current.rules[1].state).toBe('invalid')
  })

  it('match transitions to invalid when was matching then diverges', () => {
    const { result, rerender } = renderHook(
      ({ pw, cpw }) => usePasswordRules(pw, cpw),
      { initialProps: { pw: 'abc', cpw: 'abc' } }
    )
    expect(result.current.rules[5].state).toBe('valid')

    rerender({ pw: 'abcd', cpw: 'abc' })
    expect(result.current.rules[5].state).toBe('invalid')
  })

  it('allValid is true only when all 6 rules pass', () => {
    const strong = 'MyStr0ngP@ssword!'
    const { result } = renderHook(() => usePasswordRules(strong, strong))
    expect(result.current.allValid).toBe(true)
  })

  it('allValid is false when one rule fails', () => {
    // Missing special char
    const weak = 'MyStr0ngPassword1'
    const { result } = renderHook(() => usePasswordRules(weak, weak))
    expect(result.current.allValid).toBe(false)
  })
})
