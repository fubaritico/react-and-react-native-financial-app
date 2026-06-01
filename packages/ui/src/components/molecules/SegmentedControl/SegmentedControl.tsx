/** A single selectable option within a SegmentedControl. */
export interface ISegmentOption {
  /** Stable value emitted through `onChange` when this segment becomes selected. */
  value: string
  /** Visible, already-translated label rendered inside the segment. */
  label: string
}

/** Props for the SegmentedControl component — a single-choice radio button bar. */
export interface ISegmentedControlProps {
  /** Optional heading rendered above the bar (Typography `label` variant). Omitted entirely when not provided. */
  label?: string
  /** Ordered list of segments rendered left to right. Provide at least two options. */
  segments: readonly ISegmentOption[]
  /** Value of the currently selected segment (controlled). */
  value: string
  /** Fired with the chosen segment's value when the selection changes. */
  onChange: (value: string) => void
  /** Accessible label describing the group as a whole (e.g. "Transaction type"). */
  accessibilityLabel: string
  /** Shared radio-group name used to associate the underlying radio inputs (web only — native ignores it). When omitted, the web implementation generates a stable name so keyboard grouping still works. */
  name?: string
  /** Disables interaction with every segment. */
  disabled?: boolean
}
