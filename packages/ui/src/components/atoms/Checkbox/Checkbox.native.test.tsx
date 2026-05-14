import { fireEvent, render, screen } from '@testing-library/react-native'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox } from './Checkbox.native'

describe('Checkbox (native)', () => {
  it('renders an unchecked checkbox', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeTruthy()
  })

  it('renders a checked checkbox', () => {
    render(<Checkbox checked={true} onChange={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeTruthy()
  })

  it('calls onChange with true when pressing unchecked', () => {
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} />)
    fireEvent.press(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange with false when pressing checked', () => {
    const onChange = vi.fn()
    render(<Checkbox checked={true} onChange={onChange} />)
    fireEvent.press(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} disabled />)
    expect(screen.getByRole('checkbox', { disabled: true })).toBeTruthy()
  })

  it('renders label text', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label="Accept terms" />)
    expect(screen.getByText('Accept terms')).toBeTruthy()
  })

  it('uses label as accessible name', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label="Accept terms" />)
    expect(screen.getByLabelText('Accept terms')).toBeTruthy()
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
    expect(
      screen.getByLabelText('Accept the terms and conditions')
    ).toBeTruthy()
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

  it('sets indeterminate accessibility state', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} indeterminate />)
    expect(screen.getByRole('checkbox', { checked: 'mixed' })).toBeTruthy()
  })
})
