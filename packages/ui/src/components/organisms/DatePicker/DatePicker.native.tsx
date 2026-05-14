import DateTimePicker from '@react-native-community/datetimepicker'
import { useCallback, useMemo, useState } from 'react'
import { Platform, Pressable, View } from 'react-native'

import tw from '#Lib/tw'

import { native, shared } from './DatePicker.styles'
import { datePickerVariants } from './DatePicker.variants'

import type { IDatePickerProps } from './DatePicker'
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'

import { Icon, Typography } from '#Atoms'

/** Parse ISO string "2024-07-29" to a JS Date (local midnight) */
function isoToDate(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Format a JS Date to display string "29 Jul 2024" */
function formatDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Native implementation of the DatePicker component */
export function DatePicker({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  error,
  disabled,
  min,
  max,
  accessibilityLabel,
}: Readonly<IDatePickerProps>) {
  const [show, setShow] = useState(false)

  /** Current date value as JS Date (for the picker) */
  const dateValue = useMemo(
    () => (value ? isoToDate(value) : new Date()),
    [value]
  )

  /** Minimum selectable date */
  const minDate = useMemo(() => (min ? isoToDate(min) : undefined), [min])

  /** Maximum selectable date */
  const maxDate = useMemo(() => (max ? isoToDate(max) : undefined), [max])

  /** Display text: formatted date or null for placeholder */
  const displayText = useMemo(
    () => (value ? formatDisplay(isoToDate(value)) : null),
    [value]
  )

  const handlePress = useCallback(() => {
    if (!disabled) setShow((prev) => !prev)
  }, [disabled])

  const handleChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      // Android: dialog closes on set or dismiss
      if (Platform.OS === 'android') setShow(false)

      if (event.type === 'set' && selectedDate) {
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.getDate()).padStart(2, '0')
        onChange(`${String(year)}-${month}-${day}`)
      }
    },
    [onChange]
  )

  return (
    <View style={tw`flex-col ${shared.wrapper}`}>
      {label ? (
        <Typography variant="label" color="muted">
          {label}
        </Typography>
      ) : null}

      <Pressable
        onPress={handlePress}
        disabled={!!disabled}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        style={tw`${datePickerVariants({ error: !!error, disabled: !!disabled })} ${native.triggerLayout}`}
      >
        <View style={tw`${native.iconWrap}`}>
          <Icon name="calendar" iconSize="xxl" color={tw.color('grey-500')} />
        </View>
        <View style={tw`${native.contentWrap}`}>
          {displayText ? (
            <Typography variant="body">{displayText}</Typography>
          ) : (
            <Typography variant="body" color="beige-500">
              {placeholder ?? 'Select date'}
            </Typography>
          )}
        </View>
      </Pressable>

      {helperText ? (
        <Typography variant="caption" color={error ? 'destructive' : 'muted'}>
          {helperText}
        </Typography>
      ) : null}

      {show ? (
        <View accessibilityLiveRegion="polite">
          <DateTimePicker
            value={dateValue}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            minimumDate={minDate}
            maximumDate={maxDate}
            onChange={handleChange}
          />
        </View>
      ) : null}
    </View>
  )
}
