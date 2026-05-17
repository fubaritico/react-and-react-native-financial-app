import { useCallback, useRef, useState } from 'react'

import { cn } from '#Lib/cn'

import { shared, web } from './OtpInput.styles'
import { otpCellVariants } from './OtpInput.variants'

import type { IOtpInputProps } from './OtpInput'
import type { ClipboardEvent, KeyboardEvent } from 'react'

/** Default number of OTP digits */
const DEFAULT_LENGTH = 6

/**
 * Web implementation of the OTP input component.
 * Renders individual input cells with auto-focus on digit entry, backspace navigation, and paste support.
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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  const focusCell = useCallback(
    (index: number) => {
      if (index >= 0 && index < length) {
        inputRefs.current[index]?.focus()
      }
    },
    [length]
  )

  const handleInput = useCallback(
    (text: string, index: number) => {
      if (disabled) return

      const digit = text.replace(/\D/g, '').slice(-1)
      if (!digit) return

      const newDigits = [...digits]
      newDigits[index] = digit
      const newValue = newDigits.join('').replace(/ /g, '').trim()
      onChangeText(newValue)

      if (index < length - 1) {
        focusCell(index + 1)
      }

      if (newValue.length === length) {
        onComplete?.(newValue)
      }
    },
    [disabled, digits, length, onChangeText, onComplete, focusCell]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace') {
        e.preventDefault()
        const newDigits = [...digits]
        if (digits[index]) {
          // Clear current cell
          newDigits[index] = ''
          onChangeText(newDigits.join('').trim())
        } else if (index > 0) {
          // Move to previous cell and clear it
          newDigits[index - 1] = ''
          onChangeText(newDigits.join('').trim())
          focusCell(index - 1)
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault()
        focusCell(index - 1)
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault()
        focusCell(index + 1)
      }
    },
    [digits, length, onChangeText, focusCell]
  )

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pastedText = e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, length)
      if (!pastedText) return

      onChangeText(pastedText)
      if (pastedText.length === length) {
        onComplete?.(pastedText)
        inputRefs.current[length - 1]?.blur()
      } else {
        focusCell(pastedText.length)
      }
    },
    [length, onChangeText, onComplete, focusCell]
  )

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index)
  }, [])

  const handleBlur = useCallback(() => {
    setFocusedIndex(null)
  }, [])

  return (
    <div className={shared.root} role="group" aria-label={accessibilityLabel}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`${accessibilityLabel} digit ${String(index + 1)}`}
          className={cn(
            otpCellVariants({
              size,
              focused: focusedIndex === index,
              hasError: !!hasError,
              disabled: !!disabled,
            }),
            web.cellFocus,
            web.cellTransition,
            web.cellCaret,
            web.cellText
          )}
          onInput={(e) => {
            handleInput((e.target as HTMLInputElement).value, index)
          }}
          onKeyDown={(e) => {
            handleKeyDown(e, index)
          }}
          onPaste={handlePaste}
          onFocus={() => {
            handleFocus(index)
          }}
          onBlur={handleBlur}
        />
      ))}
    </div>
  )
}
