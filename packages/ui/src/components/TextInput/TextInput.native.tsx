import { Icon } from '@financial-app/icons'
import { TextInput as RNTextInput, Text, View } from 'react-native'

import tw from '../../lib/tw'
import { textInputVariants } from '../../variants/textInput.variants'

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
    <View style={tw`gap-1`}>
      <Text style={tw`text-xs font-bold text-grey-500`}>{label}</Text>
      <View style={tw`${inputClasses} flex-row items-center`}>
        {prefix ? (
          <Text style={tw`text-beige-500 text-sm mr-2`}>{prefix}</Text>
        ) : null}
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={tw.color('beige-500')}
          secureTextEntry={secureTextEntry}
          style={tw`flex-1 text-sm text-grey-900 p-0`}
        />
        {trailingElement ??
          (icon ? <Icon name={icon} size={16} color="#696868" /> : null)}
      </View>
      {helperText ? (
        <Text
          style={tw`text-xs ${error ? 'text-red' : 'text-grey-500'} text-right`}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  )
}
