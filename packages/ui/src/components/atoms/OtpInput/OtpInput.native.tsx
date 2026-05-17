import { useCallback, useRef } from 'react'
import { TextInput, View } from 'react-native'

import tw from '#Lib/tw'

import { native, shared } from './OtpInput.styles'
import { otpCellVariants } from './OtpInput.variants'

import type { IOtpInputProps } from './OtpInput'
import type { TextInputKeyPressEvent } from 'react-native'

/** Default number of OTP digits */
const DEFAULT_LENGTH = 6

/**
 * Native implementation of the OTP input component.
 * Renders individual TextInput cells with auto-focus on digit entry and backspace navigation.
 */
export function OtpInput({
  length = DEFAULT_LENGTH,
  value,
  onChangeText,
  onComplete,
  hasError,
  disabled,
  size,
  accessibilityLabel,
}: Readonly<IOtpInputProps>) {
  const inputRefs = useRef<(TextInput | null)[]>([])
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  const focusCell = useCallback(
    (index: number) => {
      if (index >= 0 && index < length) {
        inputRefs.current[index]?.focus()
      }
    },
    [length]
  )

  const handleChange = useCallback(
    (text: string, index: number) => {
      if (disabled) return

      // Handle paste — distribute digits across cells
      if (text.length > 1) {
        const pastedDigits = text.replace(/\D/g, '').slice(0, length)
        const newValue = pastedDigits
          .padEnd(length, ' ')
          .slice(0, length)
          .replace(/ /g, '')
        onChangeText(newValue)
        if (newValue.length === length) {
          onComplete?.(newValue)
          inputRefs.current[length - 1]?.blur()
        } else {
          focusCell(newValue.length)
        }
        return
      }

      // Single digit entry
      const digit = text.replace(/\D/g, '')
      const newDigits = [...digits]
      newDigits[index] = digit
      const newValue = newDigits.join('').replace(/ /g, '').trim()
      onChangeText(newValue)

      if (digit && index < length - 1) {
        focusCell(index + 1)
      }

      if (newValue.length === length) {
        onComplete?.(newValue)
      }
    },
    [disabled, length, digits, onChangeText, onComplete, focusCell]
  )

  const handleKeyPress = useCallback(
    (e: TextInputKeyPressEvent, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
        // Backspace on empty cell — move to previous and clear it
        const newDigits = [...digits]
        newDigits[index - 1] = ''
        onChangeText(newDigits.join('').trim())
        focusCell(index - 1)
      }
    },
    [digits, onChangeText, focusCell]
  )

  return (
    <View
      style={tw`${shared.root}`}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="summary"
    >
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref
          }}
          value={digit}
          onChangeText={(text) => {
            handleChange(text, index)
          }}
          onKeyPress={(e) => {
            handleKeyPress(e, index)
          }}
          keyboardType="number-pad"
          maxLength={length}
          editable={!disabled}
          selectTextOnFocus
          accessibilityLabel={`${accessibilityLabel} digit ${String(index + 1)}`}
          accessibilityState={{ disabled: !!disabled }}
          style={[
            tw`${otpCellVariants({ size, focused: false, hasError: !!hasError, disabled: !!disabled })}`,
            tw`${native.cellText}`,
          ]}
        />
      ))}
    </View>
  )
}
