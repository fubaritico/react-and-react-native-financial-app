import { View } from 'react-native'

import { resolveColor } from '#Lib/resolveColor'
import tw from '#Lib/tw'

import { useBottomSheetContext } from './BottomSheetContext'

import type { IBottomSheetHeaderProps } from './BottomSheet'

import { Button, Icon, Typography } from '#Atoms'

/**
 * Native BottomSheet.Header — renders children on the left and a close button on the right.
 */
export function BottomSheetHeader({
  children,
  closeLabel = 'Close',
}: Readonly<IBottomSheetHeaderProps>) {
  const { variant, onClose } = useBottomSheetContext()
  const isDark = variant === 'dark'

  return (
    <View
      data-name="bottom-sheet-header"
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
        variant="ghost"
        size="icon"
        onPress={onClose}
        accessibilityLabel={closeLabel}
      >
        <Icon
          name="closeModal"
          iconSize="xxl"
          color={resolveColor(isDark ? 'white' : 'foreground')}
        />
      </Button>
    </View>
  )
}
