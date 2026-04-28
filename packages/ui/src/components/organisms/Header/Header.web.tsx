import { cn } from '#Lib/cn'

import { Typography } from '#Atoms/index.web'

import { shared } from './Header.styles'
import { headerVariants } from './Header.variants'

import type { IHeaderProps } from './Header'

/** Web implementation of the Header component. */
export const Header = ({ title, subtitle }: Readonly<IHeaderProps>) => (
  <header className={cn(headerVariants())}>
    <Typography variant="heading-lg" color="on-dark" as="h1">
      {title}
    </Typography>
    {subtitle && (
      <Typography
        variant="body"
        color="on-dark"
        as="p"
        className={shared.subtitle}
      >
        {subtitle}
      </Typography>
    )}
  </header>
)
