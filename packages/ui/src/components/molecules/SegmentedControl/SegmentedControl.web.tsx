import { useCallback, useId } from 'react'

import { cn } from '#Lib/cn'

import { Typography } from '#Atoms/index.web'

import { shared, web } from './SegmentedControl.styles'
import { segmentVariants } from './SegmentedControl.variants'

import type { ISegmentOption, ISegmentedControlProps } from './SegmentedControl'

/** Props for a single web segment. */
interface IWebSegmentProps {
  /** Segment definition (value + label). */
  option: ISegmentOption
  /** Shared radio-group name associating the underlying radio inputs. */
  name: string
  /** Whether this segment is the currently selected option. */
  selected: boolean
  /** Whether this is the first (leftmost) segment — rounds the left corners. */
  first: boolean
  /** Whether this is the last (rightmost) segment — draws the closing right border and rounds the right corners. */
  last: boolean
  /** Whether the whole control is disabled. */
  disabled: boolean
  /** Fires with the segment value when chosen. */
  onSelect: (value: string) => void
}

/**
 * Single radio segment (web) — a label wrapping a visually hidden native radio input.
 * @param props - Segment option, group name, selection/first/last/disabled flags, and select callback.
 * @returns A label containing an accessible radio input and its visible content.
 */
function WebSegment({
  option,
  name,
  selected,
  first,
  last,
  disabled,
  onSelect,
}: Readonly<IWebSegmentProps>) {
  const handleChange = useCallback(() => {
    onSelect(option.value)
  }, [onSelect, option.value])

  return (
    <label
      className={cn(
        segmentVariants({ selected }),
        shared.segmentFill,
        web.segment,
        first && shared.firstSegment,
        last && shared.lastSegment,
        disabled && web.disabled
      )}
    >
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={selected}
        disabled={disabled}
        onChange={handleChange}
        className={web.srOnly}
      />
      <Typography
        as="span"
        variant={selected ? 'body-bold' : 'body'}
        color={selected ? 'on-dark' : 'foreground'}
      >
        {option.label}
      </Typography>
    </label>
  )
}

/**
 * Web implementation of the SegmentedControl — a single-choice radio button bar.
 * @param props - Segments, controlled value, change handler, group label, radio name, and disabled flag.
 * @returns A radiogroup container with one radio segment per option.
 */
export function SegmentedControl({
  label,
  segments,
  value,
  onChange,
  accessibilityLabel,
  name,
  disabled = false,
}: Readonly<ISegmentedControlProps>) {
  const generatedName = useId()
  const groupName = name ?? generatedName
  const labelId = useId()
  return (
    <div className={shared.container}>
      {label ? (
        <Typography as="span" id={labelId} variant="label">
          {label}
        </Typography>
      ) : null}
      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : accessibilityLabel}
        className={shared.root}
      >
        {segments.map((option, index) => (
          <WebSegment
            key={option.value}
            option={option}
            name={groupName}
            selected={option.value === value}
            first={index === 0}
            last={index === segments.length - 1}
            disabled={disabled}
            onSelect={onChange}
          />
        ))}
      </div>
    </div>
  )
}
