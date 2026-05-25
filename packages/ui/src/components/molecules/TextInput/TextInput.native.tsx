import { Platform, TextInput as RNTextInput, View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './TextInput.styles'
import { textInputVariants } from './TextInput.variants'

import type { ITextInputProps } from './TextInput'

import { Icon, Typography } from '#Atoms'

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
  maxLength,
  autoCapitalize,
  keyboardType,
  accessibilityLabel,
  style,
}: Readonly<ITextInputProps & { style?: string }>) => {
  const inputClasses = textInputVariants({ error })

  return (
    <View style={[tw`${shared.wrapper}`, tw`${style ?? ''}`]}>
      {label && (
        <Typography variant="label" color="muted">
          {label}
        </Typography>
      )}
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
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          accessibilityLabel={accessibilityLabel ?? label}
          style={[
            tw`flex-1 text-sm text-foreground p-0`,
            // Android EditText adds extra internal padding — normalize to match iOS
            Platform.OS === 'android' && {
              includeFontPadding: false,
              textAlignVertical: 'center' as const,
              paddingVertical: 0,
            },
          ]}
        />
        {trailingElement ??
          (icon ? <Icon name={icon} iconSize="sm" color="muted" /> : null)}
      </View>
      {helperText ? (
        <Typography
          variant="caption"
          color={error ? 'destructive' : 'muted'}
          align="left"
        >
          {helperText}
        </Typography>
      ) : null}
    </View>
  )
}
