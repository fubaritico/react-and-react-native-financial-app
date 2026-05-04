import { Pressable } from 'react-native'

import tw from '#Lib/tw'

import { listboxItemVariants } from './Listbox.variants'

import type { IListboxItemProps } from './Listbox'

import { Typography } from '#Atoms'

/**
 * Native ListboxItem — styled Pressable for listbox-style items.
 * Handles active, selected, and disabled states.
 */
export function ListboxItem({
  variant = 'light',
  isActive = false,
  isSelected = false,
  disabled = false,
  destructive = false,
  children,
  onPress,
}: Readonly<IListboxItemProps>) {
  const activeStyle =
    isActive && !disabled
      ? variant === 'dark'
        ? 'bg-grey-500'
        : 'bg-beige-100'
      : ''

  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{
        disabled,
        selected: isSelected,
      }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        tw`${listboxItemVariants({ variant, isSelected, disabled })} ${activeStyle}`,
        pressed && !disabled && tw`opacity-70`,
      ]}
    >
      <Typography
        variant={isSelected ? 'body-bold' : 'body'}
        color={
          destructive
            ? 'destructive'
            : variant === 'dark'
              ? 'on-dark'
              : 'foreground'
        }
      >
        {children}
      </Typography>
    </Pressable>
  )
}
