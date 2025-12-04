import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import tw from '../lib/tw';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
}

const variantStyles = {
  primary: tw`bg-primary`,
  secondary: tw`bg-secondary`,
  outline: tw`bg-transparent border-2 border-primary`,
};

const textStyles = {
  primary: tw`text-white`,
  secondary: tw`text-black`,
  outline: tw`text-primary`,
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        tw`py-3 px-6 rounded-lg items-center justify-center`,
        variantStyles[variant],
        disabled && tw`opacity-50`,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[tw`text-base font-semibold`, textStyles[variant]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
