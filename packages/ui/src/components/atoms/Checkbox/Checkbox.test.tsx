import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Checkbox } from './Checkbox.web'

afterEach(cleanup)

describe('Checkbox', () => {
  it('renders an unchecked checkbox', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} />)
    const input = screen.getByRole('checkbox')
    expect(input).not.toBeChecked()
  })

  it('renders a checked checkbox', () => {
    render(<Checkbox checked={true} onChange={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onChange with true when clicking unchecked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange with false when clicking checked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox checked={true} onChange={onChange} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} disabled />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders label text', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label="Accept terms" />)
    expect(screen.getByText('Accept terms')).toBeTruthy()
  })

  it('uses label as accessible name', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label="Accept terms" />)
    expect(screen.getByRole('checkbox')).toHaveAccessibleName('Accept terms')
  })

  it('prefers accessibilityLabel over label', () => {
    render(
      <Checkbox
        checked={false}
        onChange={vi.fn()}
        label="Accept"
        accessibilityLabel="Accept the terms and conditions"
      />
    )
    expect(screen.getByRole('checkbox')).toHaveAccessibleName(
      'Accept the terms and conditions'
    )
  })

  it('renders error message', () => {
    render(
      <Checkbox
        checked={false}
        onChange={vi.fn()}
        error="This field is required"
      />
    )
    expect(screen.getByText('This field is required')).toBeTruthy()
  })

  it('does not render error when not provided', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} />)
    expect(screen.queryByText(/required/i)).toBeNull()
  })

  it('applies disabled state to input', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('sets indeterminate property on input', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} indeterminate />)
    const input = screen.getByRole<HTMLInputElement>('checkbox')
    expect(input.indeterminate).toBe(true)
  })

  it('does not render label when not provided', () => {
    const { container } = render(
      <Checkbox checked={false} onChange={vi.fn()} />
    )
    const label = container.querySelector('label')
    const text = (label?.textContent ?? '').trim()
    expect(text).toBe('')
  })
})
