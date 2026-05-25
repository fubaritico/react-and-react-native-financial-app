import { useCallback, useState } from 'react'

import { Icon } from '#Atoms/index.web'

import { TextInput } from '../TextInput/TextInput.web'

import { web } from './PasswordInput.styles'

import type { IPasswordInputProps } from './PasswordInput'

/** Web implementation of the PasswordInput component. */
export const PasswordInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  error,
  showToggle = true,
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
}: Readonly<IPasswordInputProps>) => {
  const [visible, setVisible] = useState(false)

  /** Toggles password visibility */
  const handleToggleVisibility = useCallback(() => {
    setVisible((v) => !v)
  }, [])

  const toggle = showToggle ? (
    <button
      type="button"
      onClick={handleToggleVisibility}
      className={web.toggle}
      aria-label={visible ? hidePasswordLabel : showPasswordLabel}
    >
      <Icon
        name={visible ? 'hidePassword' : 'showPassword'}
        iconSize="sm"
        color="muted"
      />
    </button>
  ) : undefined

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      trailingElement={toggle}
      secureTextEntry={!visible}
    />
  )
}
