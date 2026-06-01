import { useCallback } from 'react'
import { Pressable, View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './SegmentedControl.styles'
import { segmentVariants } from './SegmentedControl.variants'

import type { ISegmentOption, ISegmentedControlProps } from './SegmentedControl'

import { Typography } from '#Atoms'

/** Props for a single native segment. */
interface INativeSegmentProps {
  /** Segment definition (value + label). */
  option: ISegmentOption
  /** Whether this segment is the currently selected option. */
  selected: boolean
  /** Whether this is the first (leftmost) segment — rounds the left corners. */
  first: boolean
  /** Whether this is the last (rightmost) segment — draws the closing right border and rounds the right corners. */
  last: boolean
  /** Whether the whole control is disabled. */
  disabled: boolean
  /** Fires with the segment value when pressed. */
  onSelect: (value: string) => void
}

/**
 * Single pressable radio segment (native).
 * @param props - Segment option, selection/last/disabled flags, and the select callback.
 * @returns A Pressable styled as a radio segment.
 */
function NativeSegment({
  option,
  selected,
  first,
  last,
  disabled,
  onSelect,
}: Readonly<INativeSegmentProps>) {
  const handlePress = useCallback(() => {
    onSelect(option.value)
  }, [onSelect, option.value])

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityLabel={option.label}
      accessibilityState={{ selected, disabled }}
      style={[
        tw`${segmentVariants({ selected })}`,
        tw.style({
          [shared.firstSegment]: first,
          [shared.lastSegment]: last,
          'opacity-50': disabled,
        }),
        { flex: 1 },
      ]}
    >
      <Typography
        variant={selected ? 'body-bold' : 'body'}
        color={selected ? 'on-dark' : 'foreground'}
      >
        {option.label}
      </Typography>
    </Pressable>
  )
}

/**
 * Native implementation of the SegmentedControl — a single-choice radio button bar.
 * @param props - Segments, controlled value, change handler, group label, and disabled flag.
 * @returns A radiogroup View containing one pressable segment per option.
 */
export function SegmentedControl({
  label,
  segments,
  value,
  onChange,
  accessibilityLabel,
  disabled = false,
}: Readonly<ISegmentedControlProps>) {
  return (
    <View style={tw`${shared.container}`}>
      {label ? <Typography variant="label">{label}</Typography> : null}
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        style={tw`${shared.root}`}
      >
        {segments.map((option, index) => (
          <NativeSegment
            key={option.value}
            option={option}
            selected={option.value === value}
            first={index === 0}
            last={index === segments.length - 1}
            disabled={disabled}
            onSelect={onChange}
          />
        ))}
      </View>
    </View>
  )
}
