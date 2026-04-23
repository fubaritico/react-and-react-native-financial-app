import type { typographyVariants } from './Typography.variants'
import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

/** Shared props for Typography — platform-agnostic. */
export interface ITypographyProps extends VariantProps<
  typeof typographyVariants
> {
  /** Content to render. */
  children?: ReactNode
}

/** Native-specific Typography props (style defined in .native.tsx to avoid RN import). */
export interface ITypographyNativeProps extends ITypographyProps {
  /** Maximum number of lines before truncation. */
  numberOfLines?: number
  /** Accessibility role override. */
  accessibilityRole?: string
}

/** Web-specific Typography props. */
export interface ITypographyWebProps extends ITypographyProps {
  /** Override the default HTML tag (e.g. "span" instead of "h1"). */
  as?: string
  /** Maximum number of lines before truncation (maps to CSS line-clamp). */
  numberOfLines?: number
  /** Additional CSS classes (layout only — text styles come from variant/color props). */
  className?: string
}
