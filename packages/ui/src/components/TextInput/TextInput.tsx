import type { IconName } from '@financial-app/icons'

import type { textInputVariants } from '../../variants'
import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

/** Props for the TextInput component. */
export interface ITextInputProps extends VariantProps<
  typeof textInputVariants
> {
  /** Label displayed above the input. */
  label: string
  /** Current input value. */
  value: string
  /** Callback fired when the input value changes. */
  onChangeText: (text: string) => void
  /** Placeholder text shown when empty. */
  placeholder?: string
  /** Helper text displayed below the input. */
  helperText?: string
  /** Optional icon rendered inside the input by name (right side, e.g. "search"). */
  icon?: IconName
  /** Custom trailing element (e.g. password visibility toggle). Takes precedence over icon. */
  trailingElement?: ReactNode
  /** Optional prefix rendered inside the input (left side, e.g. "$"). */
  prefix?: string
  /** Masks the input text (native: secureTextEntry, web: type="password"). */
  secureTextEntry?: boolean
}

export { textInputVariants } from '../../variants/textInput.variants'
