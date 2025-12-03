import React from 'react';
import { View, Text } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <View className="py-4 px-5 bg-primary">
      <Text className="text-2xl font-bold text-white">{title}</Text>
      {subtitle && <Text className="text-sm text-white opacity-80 mt-1">{subtitle}</Text>}
    </View>
  );
};
