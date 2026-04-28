import { View } from 'react-native'

import tw from '#Lib/tw'

import { useDrawerContext } from './DrawerContext'

import type { IDrawerHeaderProps } from './Drawer'

import { Button, Icon, Typography } from '#Atoms'

/**
 * Native Drawer.Header — renders children on the left and a close button on the right.
 */
export function DrawerHeader({
  children,
  closeLabel = 'Close',
}: Readonly<IDrawerHeaderProps>) {
  const { variant, onClose } = useDrawerContext()
  const isDark = variant === 'dark'

  return (
    <View
      style={tw`flex-row items-center justify-between px-5 py-3 border-b ${isDark ? 'border-grey-500' : 'border-border'}`}
    >
      <View style={tw`flex-1`}>
        <Typography
          variant="body-bold"
          color={isDark ? 'on-dark' : 'foreground'}
        >
          {children}
        </Typography>
      </View>
      <Button
        variant="tertiary"
        size="sm"
        onPress={onClose}
        accessibilityLabel={closeLabel}
      >
        <Icon
          name="closeModal"
          iconSize="md"
          color={tw.color(isDark ? 'white' : 'foreground') ?? '#201F24'}
        />
      </Button>
    </View>
  )
}
