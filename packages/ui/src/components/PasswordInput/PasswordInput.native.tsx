import { useState } from 'react'
import { Pressable, Text } from 'react-native'

import tw from '../../lib/tw'
import { TextInput } from '../TextInput/TextInput.native'

import type { IPasswordInputProps } from './PasswordInput'

/** Native implementation of the PasswordInput component. */
export const PasswordInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  error,
  showToggle = true,
}: IPasswordInputProps) => {
  const [visible, setVisible] = useState(false)

  const eyeIcon = showToggle ? (
    <Pressable
      onPress={() => {
        setVisible((v) => !v)
      }}
    >
      <Text style={tw`text-grey-500 text-base`}>
        {visible ? '\u25C9' : '\u25CE'}
      </Text>
    </Pressable>
  ) : undefined

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      icon={eyeIcon}
      secureTextEntry={!visible}
    />
  )
}
