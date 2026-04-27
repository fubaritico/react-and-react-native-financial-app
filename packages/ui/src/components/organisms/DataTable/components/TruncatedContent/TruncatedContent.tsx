export interface ITruncatedContentProps {
  /** Text content to display, truncated if it overflows */
  value: string
  /** Maximum number of lines before truncation (default: 1) */
  numberOfLines?: number
}
