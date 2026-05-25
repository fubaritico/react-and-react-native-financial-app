import { Pressable } from 'react-native'

import { resolveColor } from '#Lib/resolveColor'
import tw from '#Lib/tw'

import { Icon } from '../Icon/Icon.native'
import { Typography } from '../Typography/Typography.native'

import { NAV_LABEL_COLOR, NAV_LABEL_VARIANT } from './NavItem.constants'
import { navItemVariants } from './NavItem.variants'

import type { INavItemProps } from './NavItem'

/** Native implementation of the NavItem component. */
export function NavItem({
  icon,
  label,
  active = false,
  collapsed = false,
  orientation = 'row',
  onPress,
}: Readonly<INavItemProps>) {
  const isActive = !!active
  const isRow = orientation === 'row'
  const iconColor = isActive ? ('nav-accent' as const) : ('nav-text' as const)

  /** Border color applied to the accent side (left for sidebar, bottom for bar) */
  const borderColor = isActive ? resolveColor('nav-accent') : 'transparent'

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
      style={({ pressed }) => [
        tw`${navItemVariants({ active: isActive, orientation })}`,
        { flex: 1 },
        isRow
          ? { borderLeftColor: borderColor }
          : {
              borderBottomColor: borderColor,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            },
        pressed && !isActive && tw`opacity-70`,
      ]}
    >
      <Icon name={icon} iconSize="lg" color={iconColor} />
      {!collapsed && (
        <Typography
          variant={NAV_LABEL_VARIANT[orientation ?? 'row'] ?? 'body-bold'}
          color={NAV_LABEL_COLOR[String(isActive)] ?? 'nav-text'}
        >
          {label}
        </Typography>
      )}
    </Pressable>
  )
}
