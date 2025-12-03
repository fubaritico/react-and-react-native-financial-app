import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
}

const variantStyles = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  outline: 'bg-transparent border-2 border-primary',
};

const textStyles = {
  primary: 'text-white',
  secondary: 'text-black',
  outline: 'text-primary',
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  className,
}) => {
  return (
    <TouchableOpacity
      className={twMerge(
        'py-3 px-6 rounded-lg items-center justify-center',
        variantStyles[variant],
        disabled && 'opacity-50',
        className
      )}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text className={twMerge('text-base font-semibold', textStyles[variant])}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
