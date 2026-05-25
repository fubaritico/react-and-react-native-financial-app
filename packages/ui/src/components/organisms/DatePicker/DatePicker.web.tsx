import { parseDate } from '@internationalized/date'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button as AriaButton,
  Calendar as AriaCalendar,
  DatePicker as AriaDatePicker,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Popover,
} from 'react-aria-components'

import { cn } from '#Lib/cn'

import { Icon, Typography } from '#Atoms/index.web'

import { BottomSheet } from '../../molecules/BottomSheet/BottomSheet.web'

import { dark, shared, web } from './DatePicker.styles'
import { datePickerVariants } from './DatePicker.variants'

import type { IDatePickerProps } from './DatePicker'
import type { CalendarDate } from '@internationalized/date'

const LG_BREAKPOINT = 1024

/** Reactive media query — switches live on window resize */
function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(`(min-width: ${String(LG_BREAKPOINT)}px)`).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${String(LG_BREAKPOINT)}px)`)
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
    }
    mql.addEventListener('change', handler)
    return () => {
      mql.removeEventListener('change', handler)
    }
  }, [])

  return isDesktop
}

/** Convert ISO string to CalendarDate */
function isoToCalendarDate(iso: string): CalendarDate {
  return parseDate(iso.slice(0, 10))
}

/** Format a CalendarDate to display string "29 Jul 2024" */
function formatDisplay(date: CalendarDate, locale: string): string {
  const jsDate = new Date(date.year, date.month - 1, date.day)
  return jsDate.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// Shared calendar cell className builder
// ---------------------------------------------------------------------------

interface ICellState {
  /** Whether the cell is currently selected */
  isSelected: boolean
  /** Whether the cell is disabled (outside min/max range) */
  isDisabled: boolean
  /** Whether the cell belongs to the previous/next month */
  isOutsideMonth: boolean
}

interface ICellTheme {
  /** Class for the selected day cell */
  cellSelected: string
  /** Class for a disabled day cell */
  cellDisabled: string
  /** Class for a day outside the current month */
  cellOutside: string
  /** Class for a normal (default) day cell */
  cellDefault: string
}

/**
 * Build a className function for CalendarCell based on a light/dark theme.
 * @param theme - Theme object with class strings for each cell state
 * @returns Render prop function for CalendarCell className
 */
function cellClassName(theme: ICellTheme) {
  return ({ isSelected, isDisabled, isOutsideMonth }: ICellState) =>
    cn(
      web.cellBase,
      web.cellInner,
      isSelected && theme.cellSelected,
      isDisabled && theme.cellDisabled,
      isOutsideMonth && !isDisabled && theme.cellOutside,
      !isSelected && !isDisabled && !isOutsideMonth && theme.cellDefault
    )
}

// ---------------------------------------------------------------------------
// Internal Calendar (used by MobileDatePicker in dark BottomSheet)
// ---------------------------------------------------------------------------

interface IInternalCalendarProps {
  /** Currently selected date or null */
  value: CalendarDate | null
  /** Callback when a day is selected */
  onChange: (date: CalendarDate) => void
  /** Earliest selectable date */
  minValue?: CalendarDate
  /** Latest selectable date */
  maxValue?: CalendarDate
}

/** Dark-themed standalone calendar rendered inside the mobile BottomSheet */
function InternalCalendar({
  value,
  onChange,
  minValue,
  maxValue,
}: Readonly<IInternalCalendarProps>) {
  return (
    <AriaCalendar
      value={value}
      onChange={onChange}
      minValue={minValue}
      maxValue={maxValue}
      className={dark.calendar}
    >
      <header className={web.calendarHeader}>
        <AriaButton slot="previous" className={dark.navButton}>
          <Icon name="caretLeft" iconSize="xs" color="on-dark" />
        </AriaButton>
        <Heading className={dark.calendarHeading} />
        <AriaButton slot="next" className={dark.navButton}>
          <Icon name="caretRight" iconSize="xs" color="on-dark" />
        </AriaButton>
      </header>
      <CalendarGrid className={web.grid}>
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className={dark.weekday}>
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell date={date} className={cellClassName(dark)} />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  )
}

// ---------------------------------------------------------------------------
// Desktop DatePicker (AriaDatePicker + Popover — light theme)
// ---------------------------------------------------------------------------

/** Desktop date picker — AriaDatePicker with segments, popover calendar (light theme) */
function DesktopDatePicker({
  value,
  onChange,
  label,
  helperText,
  error,
  disabled,
  min,
  max,
  accessibilityLabel,
}: Readonly<IDatePickerProps>) {
  const calendarValue = useMemo(
    () => (value ? isoToCalendarDate(value) : null),
    [value]
  )
  const minValue = useMemo(
    () => (min ? isoToCalendarDate(min) : undefined),
    [min]
  )
  const maxValue = useMemo(
    () => (max ? isoToCalendarDate(max) : undefined),
    [max]
  )

  const handleChange = useCallback(
    (date: CalendarDate | null) => {
      if (date) onChange(date.toString())
    },
    [onChange]
  )

  return (
    <AriaDatePicker
      value={calendarValue}
      onChange={handleChange}
      minValue={minValue}
      maxValue={maxValue}
      isDisabled={!!disabled}
      granularity="day"
      aria-label={accessibilityLabel ?? label}
      className={cn('flex flex-col', shared.wrapper)}
    >
      {label ? (
        <Typography variant="label" color="muted">
          {label}
        </Typography>
      ) : null}
      <Group
        className={cn(
          datePickerVariants({ error: !!error, disabled: !!disabled }),
          web.triggerInner,
          web.trigger
        )}
      >
        <DateInput className="flex flex-1 items-center">
          {(segment) => (
            <DateSegment
              segment={segment}
              className={({ isFocused, isPlaceholder }) =>
                cn(
                  web.segment,
                  isPlaceholder && !isFocused && web.segmentPlaceholder
                )
              }
            />
          )}
        </DateInput>
        <AriaButton className={web.fieldButton}>
          <Icon name="calendar" iconSize="xxl" color="muted" />
        </AriaButton>
      </Group>
      {helperText ? (
        <Typography
          variant="caption"
          color={error ? 'destructive' : 'muted'}
          align="left"
          as="span"
        >
          {helperText}
        </Typography>
      ) : null}
      <Popover className={web.popover} placement="bottom start" offset={8}>
        <Dialog className="outline-none">
          <AriaCalendar className={web.calendar}>
            <header className={web.calendarHeader}>
              <AriaButton slot="previous" className={web.navButton}>
                <Icon name="caretLeft" iconSize="xs" color="currentColor" />
              </AriaButton>
              <Heading className={web.calendarHeading} />
              <AriaButton slot="next" className={web.navButton}>
                <Icon name="caretRight" iconSize="xs" color="currentColor" />
              </AriaButton>
            </header>
            <CalendarGrid className={web.grid}>
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell className={web.weekday}>
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => (
                  <CalendarCell date={date} className={cellClassName(web)} />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </AriaCalendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  )
}

// ---------------------------------------------------------------------------
// Mobile DatePicker (trigger + dark BottomSheet + Calendar)
// ---------------------------------------------------------------------------

/** Mobile date picker — trigger button that opens a dark BottomSheet with a calendar */
function MobileDatePicker({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  error,
  disabled,
  min,
  max,
  accessibilityLabel,
  bottomSheetTitle,
  bottomSheetCloseLabel,
}: Readonly<IDatePickerProps>) {
  const [isOpen, setIsOpen] = useState(false)

  const calendarValue = useMemo(
    () => (value ? isoToCalendarDate(value) : null),
    [value]
  )
  const minValue = useMemo(
    () => (min ? isoToCalendarDate(min) : undefined),
    [min]
  )
  const maxValue = useMemo(
    () => (max ? isoToCalendarDate(max) : undefined),
    [max]
  )

  const displayText = useMemo(() => {
    if (!calendarValue) return null
    return formatDisplay(calendarValue, navigator.language)
  }, [calendarValue])

  const handleOpen = useCallback(() => {
    if (!disabled) setIsOpen(true)
  }, [disabled])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleChange = useCallback(
    (date: CalendarDate) => {
      onChange(date.toString())
      setIsOpen(false)
    },
    [onChange]
  )

  return (
    <div className={cn('flex flex-col', shared.wrapper)}>
      {label ? (
        <Typography variant="label" color="muted">
          {label}
        </Typography>
      ) : null}
      <button
        type="button"
        onClick={handleOpen}
        disabled={!!disabled}
        aria-label={accessibilityLabel ?? label}
        className={cn(
          datePickerVariants({ error: !!error, disabled: !!disabled }),
          web.triggerInner,
          web.mobileTrigger
        )}
      >
        <span className="flex-1">
          {displayText ? (
            <Typography variant="body" as="span">
              {displayText}
            </Typography>
          ) : (
            <Typography variant="body" color="beige-500" as="span">
              {placeholder}
            </Typography>
          )}
        </span>
        <Icon name="calendar" iconSize="xxl" color="muted" />
      </button>
      {helperText ? (
        <Typography
          variant="caption"
          color={error ? 'destructive' : 'muted'}
          align="left"
          as="span"
        >
          {helperText}
        </Typography>
      ) : null}
      <BottomSheet
        open={isOpen}
        onClose={handleClose}
        variant="dark"
        overlay
        accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
      >
        <BottomSheet.Header closeLabel={bottomSheetCloseLabel}>
          {bottomSheetTitle ?? label}
        </BottomSheet.Header>
        <BottomSheet.Body>
          <InternalCalendar
            value={calendarValue}
            onChange={handleChange}
            minValue={minValue}
            maxValue={maxValue}
          />
        </BottomSheet.Body>
      </BottomSheet>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DatePicker (public — switches between Desktop and Mobile)
// ---------------------------------------------------------------------------

/** Web implementation of the DatePicker component */
export function DatePicker(props: Readonly<IDatePickerProps>) {
  const isDesktop = useIsDesktop()

  if (isDesktop) return <DesktopDatePicker {...props} />
  return <MobileDatePicker {...props} />
}
