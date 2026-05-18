import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PasswordRulesList } from './PasswordRulesList.web'

import type { IPasswordRule } from './PasswordRulesList'

afterEach(cleanup)

const PRISTINE_RULES: IPasswordRule[] = [
  { label: 'At least 16 characters', state: 'pristine' },
  { label: 'At least one uppercase letter', state: 'pristine' },
  { label: 'At least one lowercase letter', state: 'pristine' },
]

const MIXED_RULES: IPasswordRule[] = [
  { label: 'At least 16 characters', state: 'valid' },
  { label: 'At least one uppercase letter', state: 'invalid' },
  { label: 'At least one lowercase letter', state: 'pristine' },
]

describe('PasswordRulesList', () => {
  it('renders all rule labels', () => {
    render(<PasswordRulesList rules={PRISTINE_RULES} />)
    expect(screen.getByText('At least 16 characters')).toBeTruthy()
    expect(screen.getByText('At least one uppercase letter')).toBeTruthy()
    expect(screen.getByText('At least one lowercase letter')).toBeTruthy()
  })

  it('renders no icons for pristine rules', () => {
    const { container } = render(<PasswordRulesList rules={PRISTINE_RULES} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(0)
  })

  it('renders icons for valid and invalid rules', () => {
    const { container } = render(<PasswordRulesList rules={MIXED_RULES} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(2)
  })

  it('renders empty list when no rules provided', () => {
    const { container } = render(<PasswordRulesList rules={[]} />)
    expect(container.querySelectorAll('svg')).toHaveLength(0)
    expect(container.textContent).toBe('')
  })

  it('renders all six rules when fully populated', () => {
    const allRules: IPasswordRule[] = [
      { label: 'Min 16 chars', state: 'valid' },
      { label: 'Uppercase', state: 'valid' },
      { label: 'Lowercase', state: 'valid' },
      { label: 'Digit', state: 'valid' },
      { label: 'Special', state: 'invalid' },
      { label: 'Match', state: 'pristine' },
    ]
    render(<PasswordRulesList rules={allRules} />)
    expect(screen.getByText('Min 16 chars')).toBeTruthy()
    expect(screen.getByText('Match')).toBeTruthy()
    const { container } = render(<PasswordRulesList rules={allRules} />)
    // 5 icons (4 valid + 1 invalid), 1 pristine has no icon
    expect(container.querySelectorAll('svg')).toHaveLength(5)
  })
})
