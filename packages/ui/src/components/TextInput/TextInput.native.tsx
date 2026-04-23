import { TextInput as RNTextInput, View } from 'react-native'

import tw from '../../lib/tw'
import { Icon } from '../Icon/Icon.native'
import { Typography } from '../Typography/Typography.native'

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
      <Typography variant="label" color="muted">
        {label}
      </Typography>
      <View style={tw`${inputClasses} flex-row items-center`}>
        {prefix ? (
          <Typography variant="body" color="beige-500" style={tw`mr-2`}>
            {prefix}
          </Typography>
        ) : null}
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
        <Typography
          variant="caption"
          color={error ? 'destructive' : 'muted'}
          align="right"
        >
          {helperText}
        </Typography>
      ) : null}
    </View>
  )
}
