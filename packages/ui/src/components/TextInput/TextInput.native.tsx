import { TextInput as RNTextInput, Text, View } from 'react-native'

import tw from '../../lib/tw'
import { Icon } from '../Icon/Icon.native'

import styles from './TextInput.styles'
import { textInputVariants } from './TextInput.variants'

import type { ITextInputProps } from './TextInput'

/** Native implementation of the TextInput component. */
export const TextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  error,
  icon,
  trailingElement,
  prefix,
  secureTextEntry,
}: ITextInputProps) => {
  const inputClasses = textInputVariants({ error })

  return (
    <View style={tw`${styles.wrapper}`}>
      <Text style={tw`${styles.label}`}>{label}</Text>
      <View style={tw`${inputClasses} flex-row items-center`}>
        {prefix ? <Text style={tw`${styles.prefix}`}>{prefix}</Text> : null}
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={tw.color('beige-500')}
          secureTextEntry={secureTextEntry}
          style={tw`flex-1 text-sm text-foreground p-0`}
        />
        {trailingElement ??
          (icon ? (
            <Icon
              name={icon}
              iconSize="sm"
              color={tw.color('foreground-muted')}
            />
          ) : null)}
      </View>
      {helperText ? (
        <Text
          style={tw`${styles.helperText} ${error ? 'text-destructive' : 'text-foreground-muted'}`}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  )
}
