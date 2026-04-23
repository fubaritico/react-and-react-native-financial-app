import { cn } from '../../lib/cn'
import { Typography } from '../Typography/Typography.web'

import type { ISectionLinkProps } from './SectionLink'

/** Web implementation of the SectionLink component. */
export const SectionLink = ({ label, onPress }: ISectionLinkProps) => (
  <button
    onClick={onPress}
    className={cn(
      'inline-flex items-center gap-3 hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0',
      'text-sm text-foreground-muted'
    )}
  >
    <Typography variant="body" color="muted" as="span">
      {label}
    </Typography>
    <span aria-hidden>&#9656;</span>
  </button>
)
