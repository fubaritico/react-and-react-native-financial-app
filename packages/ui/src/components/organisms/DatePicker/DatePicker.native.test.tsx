import { fireEvent, render, screen } from '@testing-library/react-native'
import { View } from 'react-native'
import { describe, expect, it, vi } from 'vitest'

import { DatePicker } from './DatePicker.native'

import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import type { ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Mock @react-native-community/datetimepicker
// ---------------------------------------------------------------------------

let capturedOnChange:
  | ((event: DateTimePickerEvent, date?: Date) => void)
  | undefined

vi.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    capturedOnChange = props.onChange as typeof capturedOnChange
    return <View testID="date-time-picker" />
  },
}))

// ---------------------------------------------------------------------------
// Mock BottomSheet — renders children directly when open (no Portal needed)
// ---------------------------------------------------------------------------

function MockBottomSheetHeader({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <View testID="bottom-sheet-header">{children}</View>
}

function MockBottomSheetBody({ children }: Readonly<{ children: ReactNode }>) {
  return <View testID="bottom-sheet-body">{children}</View>
}

function MockBottomSheet({
  open,
  children,
}: Readonly<{ open: boolean; children: ReactNode }>) {
  if (!open) return null
  return <View testID="bottom-sheet">{children}</View>
}

MockBottomSheet.Header = MockBottomSheetHeader
MockBottomSheet.Body = MockBottomSheetBody

vi.mock('../../molecules/BottomSheet/BottomSheet.native', () => ({
  BottomSheet: MockBottomSheet,
}))

describe('DatePicker (native)', () => {
  it('renders the trigger with button role', () => {
    render(<DatePicker value={null} onChange={vi.fn()} label="Date" />)
    expect(screen.getByRole('button')).toBeTruthy()
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

  it('shows formatted date when value is provided', () => {
    render(<DatePicker value="2024-07-29" onChange={vi.fn()} label="Date" />)
    expect(screen.getByText('Jul 29, 2024')).toBeTruthy()
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

  it('opens picker in BottomSheet on trigger press (iOS)', () => {
    render(<DatePicker value={null} onChange={vi.fn()} label="Date" />)
    expect(screen.queryByTestId('bottom-sheet')).toBeNull()
    fireEvent.press(screen.getByRole('button'))
    expect(screen.getByTestId('bottom-sheet')).toBeTruthy()
    expect(screen.getByTestId('date-time-picker')).toBeTruthy()
  })

  it('renders BottomSheet header with label', () => {
    render(<DatePicker value={null} onChange={vi.fn()} label="Date" />)
    fireEvent.press(screen.getByRole('button'))
    expect(screen.getByTestId('bottom-sheet-header')).toBeTruthy()
  })

  it('does not open picker when disabled', () => {
    render(<DatePicker value={null} onChange={vi.fn()} label="Date" disabled />)
    fireEvent.press(screen.getByRole('button'))
    expect(screen.queryByTestId('bottom-sheet')).toBeNull()
  })

  it('calls onChange with ISO string on date selection', () => {
    const onChange = vi.fn()
    render(<DatePicker value={null} onChange={onChange} label="Date" />)
    fireEvent.press(screen.getByRole('button'))

    const event = { type: 'set', nativeEvent: { timestamp: 0 } }
    capturedOnChange?.(event as DateTimePickerEvent, new Date(2024, 6, 29))

    expect(onChange).toHaveBeenCalledWith('2024-07-29')
  })

  it('does not call onChange on dismiss event', () => {
    const onChange = vi.fn()
    render(<DatePicker value={null} onChange={onChange} label="Date" />)
    fireEvent.press(screen.getByRole('button'))

    const event = { type: 'dismissed', nativeEvent: { timestamp: 0 } }
    capturedOnChange?.(event as DateTimePickerEvent, undefined)

    expect(onChange).not.toHaveBeenCalled()
  })

  it('sets disabled accessibility state', () => {
    render(<DatePicker value={null} onChange={vi.fn()} label="Date" disabled />)
    expect(screen.getByRole('button', { disabled: true })).toBeTruthy()
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
    expect(screen.getByLabelText('Select transaction date')).toBeTruthy()
  })

  it('falls back to label for accessibilityLabel', () => {
    render(
      <DatePicker value={null} onChange={vi.fn()} label="Transaction date" />
    )
    expect(screen.getByLabelText('Transaction date')).toBeTruthy()
  })
})
