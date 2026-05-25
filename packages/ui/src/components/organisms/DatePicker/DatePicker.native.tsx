import DateTimePicker from '@react-native-community/datetimepicker'
import { useCallback, useMemo, useState } from 'react'
import { Platform, Pressable, View } from 'react-native'

import { resolveColor } from '#Lib/resolveColor'
import tw from '#Lib/tw'

import { native, shared } from './DatePicker.styles'
import { datePickerVariants } from './DatePicker.variants'

import type { IDatePickerProps } from './DatePicker'
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'

import { Icon, Typography } from '#Atoms'
import { BottomSheet } from '#Molecules'

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
    if (!disabled) setShow(true)
  }, [disabled])

  /** Close the BottomSheet (iOS) or dismiss (Android handled by picker) */
  const handleClose = useCallback(() => {
    setShow(false)
  }, [])

  const handleChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      // Android: dialog closes on set or dismiss
      if (Platform.OS === 'android') setShow(false)

      if (event.type === 'set' && selectedDate) {
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.getDate()).padStart(2, '0')
        onChange(`${String(year)}-${month}-${day}`)
        // iOS inline: close BottomSheet after date selection
        if (Platform.OS === 'ios') setShow(false)
      }
    },
    [onChange]
  )

  /** Accent color for iOS inline calendar on dark BottomSheet */
  /** Accent color for iOS inline calendar on dark BottomSheet */
  const accentColor = useMemo(() => resolveColor('beige-500'), [])

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

      {/*
        iOS: inline calendar inside a dark BottomSheet (display="inline" overflows without container).
        Android: native Material dialog (display="default") — floats above everything, no BottomSheet needed.
      */}
      {Platform.OS === 'ios' ? (
        <BottomSheet
          open={show}
          onClose={handleClose}
          variant="dark"
          overlay
          accessibilityLabel={accessibilityLabel ?? label ?? 'Date picker'}
        >
          <BottomSheet.Header closeLabel="Done">
            {label ?? 'Select date'}
          </BottomSheet.Header>
          <BottomSheet.Body>
            <View
              accessibilityLiveRegion="polite"
              style={tw`items-center pb-4`}
            >
              <DateTimePicker
                value={dateValue}
                mode="date"
                display="inline"
                minimumDate={minDate}
                maximumDate={maxDate}
                onChange={handleChange}
                themeVariant="dark"
                accentColor={accentColor}
              />
            </View>
          </BottomSheet.Body>
        </BottomSheet>
      ) : show ? (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={handleChange}
        />
      ) : null}
    </View>
  )
}
