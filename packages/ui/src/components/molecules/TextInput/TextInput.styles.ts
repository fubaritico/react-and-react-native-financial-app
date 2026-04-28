/** Shared layout classes for TextInput inner elements (safe for both native and web) */
export const shared = {
  /** Vertical gap between label, input, and helper text */
  wrapper: 'gap-1',
} as const

/** Web-only classes for TextInput (focus, transition) */
export const web = {
  /** Focus ring on input row container */
  inputRow: 'focus-within:border-foreground transition-colors',
  /** Input element reset + placeholder */
  input: 'outline-none placeholder:text-beige-500',
} as const
