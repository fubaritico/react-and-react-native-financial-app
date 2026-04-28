import type { ITypographyWebProps } from '#Atoms/Typography/Typography'

/** Props for TruncatedContent — renders text truncated to a maximum number of lines with a tooltip on hover. */
export interface ITruncatedContentProps extends ITypographyWebProps {
  /** Text content to display, truncated if it overflows */
  value: string
  /** Maximum number of lines before truncation (default: 1) */
  numberOfLines?: number
}
