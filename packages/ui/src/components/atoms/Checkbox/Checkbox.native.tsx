import { useCallback } from 'react'
import { Pressable, View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './Checkbox.styles'
import { checkboxVariants } from './Checkbox.variants'

import type { ICheckboxProps } from './Checkbox'

import { Icon, Typography } from '#Atoms'

/** Minimum touch target size in points (WCAG 2.5.5) */
const MIN_TOUCH_TARGET = 44

/**
 * Resolves which icon to show inside the box.
 * @param checked - Whether the checkbox is checked
 * @param indeterminate - Whether the checkbox is in mixed state
 * @returns Icon name or null when unchecked
 */
function resolveCheckIcon(
  checked: boolean,
  indeterminate?: boolean
): 'minus' | 'tick' | null {
  if (indeterminate) return 'minus'
  if (checked) return 'tick'
  return null
}

/**
 * Native implementation of the Checkbox component.
 * @param props - Checkbox props (checked, onChange, label, disabled, indeterminate, error, size, accessibilityLabel)
 */
export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  indeterminate,
  error,
  size,
  accessibilityLabel,
}: Readonly<ICheckboxProps>) {
  const isVisuallyChecked = indeterminate ?? checked
  const iconName = resolveCheckIcon(checked, indeterminate)

  const handlePress = useCallback(() => {
    onChange(!checked)
  }, [checked, onChange])

  return (
    <View>
      <Pressable
        onPress={handlePress}
        disabled={!!disabled}
        accessibilityRole="checkbox"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{
          checked: indeterminate ? 'mixed' : checked,
          disabled: !!disabled,
        }}
        hitSlop={label ? undefined : MIN_TOUCH_TARGET}
        style={tw`${shared.root}`}
      >
        <View
          style={tw`${checkboxVariants({ size, checked: isVisuallyChecked, hasError: !!error, disabled: !!disabled })}`}
        >
          {iconName ? (
            <Icon name={iconName} iconSize="xs" color="white" />
          ) : null}
        </View>
        {label ? (
          <Typography variant="body" color={disabled ? 'muted' : 'foreground'}>
            {label}
          </Typography>
        ) : null}
      </Pressable>
      {error ? (
        <View style={tw`${shared.errorWrap} ml-8`}>
          <Typography variant="caption" color="destructive">
            {error}
          </Typography>
        </View>
      ) : null}
    </View>
  )
}
