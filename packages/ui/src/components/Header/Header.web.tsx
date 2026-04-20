import { cn } from '../../lib/cn'
import { headerVariants } from '../../variants'

import type { HeaderProps } from './Header'

/** Web implementation of the Header component. */
export const Header = ({ title, subtitle }: HeaderProps) => (
  <header className={cn(headerVariants())}>
    <h1 className="text-2xl font-bold text-white">{title}</h1>
    {subtitle && (
      <p className="text-sm text-white opacity-80 mt-1">{subtitle}</p>
    )}
  </header>
)
