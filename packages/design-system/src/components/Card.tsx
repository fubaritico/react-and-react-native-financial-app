import React from 'react';
import { View, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  title: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, text, children, className }) => {
  return (
    <View
      className={twMerge(
        'bg-white rounded-xl p-4 shadow-md',
        className
      )}
    >
      <Text className="text-lg font-semibold text-gray-900 mb-2">{title}</Text>
      {text && <Text className="text-sm text-gray-600 leading-5">{text}</Text>}
      {children && <View className="mt-3">{children}</View>}
    </View>
  );
};
