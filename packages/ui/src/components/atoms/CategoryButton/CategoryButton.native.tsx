import { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'

import { resolveColor } from '#Lib/resolveColor'
import tw from '#Lib/tw'

import { Icon } from '../Icon/Icon.native'
import { Typography } from '../Typography/Typography.native'

import {
  CIRCLE_SIZE,
  DELETE_MODE_DURATION_MS,
} from './CategoryButton.constants'
import { native, shared } from './CategoryButton.styles'

import type { ICategoryButtonProps } from './CategoryButton'

/**
 * Native implementation of the CategoryButton — grey cell with colored circle, icon,
 * name label, and long-press-to-delete behaviour.
 * Long-pressing a deletable category activates delete mode for 5 seconds,
 * during which tapping the circle triggers onDelete.
 * @param props - Category button props
 * @returns A grey cell containing the colored circle + name below
 */
export function CategoryButton({
  id,
  icon,
  color,
  name,
  accessibilityLabel,
  isDeletable,
  onDelete,
  isDeleting,
}: Readonly<ICategoryButtonProps>) {
  const [deleteMode, setDeleteMode] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** Clears the active delete-mode timer. */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => clearTimer, [clearTimer])

  /**
   * Activates delete mode and starts the auto-reset timer.
   * @returns void
   */
  const handleLongPress = useCallback(() => {
    if (!isDeletable || isDeleting) return
    setDeleteMode(true)
    clearTimer()
    timerRef.current = setTimeout(() => {
      setDeleteMode(false)
    }, DELETE_MODE_DURATION_MS)
  }, [isDeletable, isDeleting, clearTimer])

  /**
   * Fires onDelete and exits delete mode.
   * @returns void
   */
  const handlePress = useCallback(() => {
    if (!deleteMode || !onDelete || !id) return
    clearTimer()
    setDeleteMode(false)
    onDelete(id)
  }, [deleteMode, onDelete, clearTimer, id])

  const showBadge = isDeletable && (deleteMode || isDeleting)

  return (
    <Pressable
      onPress={deleteMode ? handlePress : undefined}
      onLongPress={isDeletable ? handleLongPress : undefined}
      disabled={!!isDeleting}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={isDeletable ? 'button' : 'image'}
      accessibilityState={{ disabled: !!isDeleting }}
      style={tw`${native.cell}`}
    >
      <View
        style={[
          tw`${shared.circle}`,
          {
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            backgroundColor: resolveColor(color),
            overflow: 'visible' as const,
          },
        ]}
      >
        <Icon name={icon} iconSize="xl" color="on-dark" />
        {showBadge && (
          <View style={tw`${native.badge}`}>
            <Icon name="cross" iconSize="4xs" color="on-dark" />
          </View>
        )}
      </View>
      <Typography
        variant="caption"
        align="center"
        numberOfLines={1}
        style={tw`${native.label}`}
      >
        {name}
      </Typography>
    </Pressable>
  )
}
