import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DatePicker } from './DatePicker.web'

// ---------------------------------------------------------------------------
// matchMedia mock — controls desktop vs mobile mode
// ---------------------------------------------------------------------------

let matchMediaMatches = true

function mockMatchMedia(query: string) {
  const listeners: ((e: MediaQueryListEvent) => void)[] = []
  return {
    matches: matchMediaMatches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(
      (_: string, handler: (e: MediaQueryListEvent) => void) => {
        listeners.push(handler)
      }
    ),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
}

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(mockMatchMedia),
  })
})

afterEach(cleanup)

// ---------------------------------------------------------------------------
// Desktop mode
// ---------------------------------------------------------------------------

describe('DatePicker — Desktop', () => {
  beforeEach(() => {
    matchMediaMatches = true
  })

  it('renders label text', () => {
    render(
      <DatePicker value={null} onChange={vi.fn()} label="Transaction date" />
    )
    expect(screen.getByText('Transaction date')).toBeTruthy()
  })

  it('does not render label when not provided', () => {
    render(<DatePicker value={null} onChange={vi.fn()} />)
    expect(screen.queryByText('Transaction date')).toBeNull()
  })

  it('renders date segments when value is provided', () => {
    render(<DatePicker value="2024-07-29" onChange={vi.fn()} label="Date" />)
    expect(screen.getByText('29')).toBeTruthy()
    expect(screen.getByText('7')).toBeTruthy()
    expect(screen.getByText('2024')).toBeTruthy()
  })

  it('renders the calendar icon', () => {
    render(<DatePicker value={null} onChange={vi.fn()} label="Date" />)
    const svg = document.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('renders helperText', () => {
    render(
      <DatePicker value={null} onChange={vi.fn()} helperText="Pick a date" />
    )
    expect(screen.getByText('Pick a date')).toBeTruthy()
  })

  it('does not render helperText when not provided', () => {
    render(<DatePicker value={null} onChange={vi.fn()} />)
    expect(screen.queryByText('Pick a date')).toBeNull()
  })

  it('renders helperText in error style when error is true', () => {
    render(
      <DatePicker
        value={null}
        onChange={vi.fn()}
        error={true}
        helperText="Date is required"
      />
    )
    const helper = screen.getByText('Date is required')
    expect(helper).toBeTruthy()
  })

  it('applies disabled state', () => {
    render(
      <DatePicker value="2024-07-29" onChange={vi.fn()} label="Date" disabled />
    )
    const group = document.querySelector('[data-disabled]')
    expect(group).toBeTruthy()
  })

  it('uses accessibilityLabel when provided', () => {
    render(
      <DatePicker
        value={null}
        onChange={vi.fn()}
        label="Date"
        accessibilityLabel="Select transaction date"
      />
    )
    const picker = document.querySelector(
      '[aria-label="Select transaction date"]'
    )
    expect(picker).toBeTruthy()
  })

  it('falls back to label for aria-label', () => {
    render(
      <DatePicker value={null} onChange={vi.fn()} label="Transaction date" />
    )
    const picker = document.querySelector('[aria-label="Transaction date"]')
    expect(picker).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Mobile mode
// ---------------------------------------------------------------------------

describe('DatePicker — Mobile', () => {
  beforeEach(() => {
    matchMediaMatches = false
  })

  it('renders label text', () => {
    render(
      <DatePicker value={null} onChange={vi.fn()} label="Transaction date" />
    )
    expect(screen.getByText('Transaction date')).toBeTruthy()
  })

  it('does not render label when not provided', () => {
    render(<DatePicker value={null} onChange={vi.fn()} />)
    expect(screen.queryByText('Transaction date')).toBeNull()
  })

  it('shows default placeholder when no value', () => {
    render(<DatePicker value={null} onChange={vi.fn()} label="Date" />)
    expect(screen.getByText('Select date')).toBeTruthy()
  })

  it('shows custom placeholder when provided', () => {
    render(
      <DatePicker
        value={null}
        onChange={vi.fn()}
        label="Date"
        placeholder="Pick a date"
      />
    )
    expect(screen.getByText('Pick a date')).toBeTruthy()
  })

  it('shows formatted date in English locale', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')
    render(<DatePicker value="2024-07-29" onChange={vi.fn()} label="Date" />)
    const trigger = screen.getByRole('button')
    expect(trigger.textContent).toContain('Jul')
    expect(trigger.textContent).toContain('29')
    expect(trigger.textContent).toContain('2024')
  })

  it('shows formatted date in French locale', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR')
    render(<DatePicker value="2024-07-29" onChange={vi.fn()} label="Date" />)
    const trigger = screen.getByRole('button')
    expect(trigger.textContent).toContain('juil.')
    expect(trigger.textContent).toContain('29')
    expect(trigger.textContent).toContain('2024')
  })

  it('renders helperText', () => {
    render(
      <DatePicker value={null} onChange={vi.fn()} helperText="Required field" />
    )
    expect(screen.getByText('Required field')).toBeTruthy()
  })

  it('renders the calendar icon', () => {
    render(<DatePicker value={null} onChange={vi.fn()} />)
    const svg = document.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('opens BottomSheet on trigger click', async () => {
    const user = userEvent.setup()
    render(<DatePicker value={null} onChange={vi.fn()} label="Date" />)
    await user.click(screen.getByRole('button'))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeTruthy()
  })

  it('does not open BottomSheet when disabled', async () => {
    const user = userEvent.setup()
    render(<DatePicker value={null} onChange={vi.fn()} label="Date" disabled />)
    await user.click(screen.getByRole('button'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('applies disabled attribute on trigger button', () => {
    render(<DatePicker value={null} onChange={vi.fn()} label="Date" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('uses accessibilityLabel on trigger', () => {
    render(
      <DatePicker
        value={null}
        onChange={vi.fn()}
        label="Date"
        accessibilityLabel="Select transaction date"
      />
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Select transaction date'
    )
  })

  it('falls back to label for aria-label on trigger', () => {
    render(
      <DatePicker value={null} onChange={vi.fn()} label="Transaction date" />
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Transaction date'
    )
  })

  it('BottomSheet has correct accessibility label', async () => {
    const user = userEvent.setup()
    render(
      <DatePicker
        value={null}
        onChange={vi.fn()}
        label="Date"
        accessibilityLabel="Pick date"
      />
    )
    await user.click(screen.getByRole('button'))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-label',
      'Pick date'
    )
  })

  it('BottomSheet header shows label', async () => {
    const user = userEvent.setup()
    render(
      <DatePicker value={null} onChange={vi.fn()} label="Transaction date" />
    )
    await user.click(screen.getByRole('button'))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Transaction date')).toBeTruthy()
  })
})
