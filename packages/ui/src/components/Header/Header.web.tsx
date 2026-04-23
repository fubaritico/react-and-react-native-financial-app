import { cn } from '../../lib/cn'
import { Typography } from '../Typography/Typography.web'

import { headerVariants } from './Header.variants'

import type { IHeaderProps } from './Header'

/** Web implementation of the Header component. */
export const Header = ({ title, subtitle }: IHeaderProps) => (
  <header className={cn(headerVariants())}>
    <Typography variant="heading-lg" color="on-dark" as="h1">
      {title}
    </Typography>
    {subtitle && (
      <Typography
        variant="body"
        color="on-dark"
        as="p"
        className="opacity-80 mt-1"
      >
        {subtitle}
      </Typography>
    )}
  </header>
)
