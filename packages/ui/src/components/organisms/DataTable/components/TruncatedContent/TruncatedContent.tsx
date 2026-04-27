import type { ITypographyWebProps } from '../../../../atoms/Typography/Typography'

export interface ITruncatedContentProps extends ITypographyWebProps {
  /** Text content to display, truncated if it overflows */
  value: string
  /** Maximum number of lines before truncation (default: 1) */
  numberOfLines?: number
}
