import { cn } from '#Lib/cn'

import { Typography } from '#Atoms/index.web'

import { shared, web } from './SectionLink.styles'

import type { ISectionLinkProps } from './SectionLink'

/** Web implementation of the SectionLink component. */
export const SectionLink = ({
  label,
  onPress,
}: Readonly<ISectionLinkProps>) => (
  <button
    onClick={onPress}
    className={cn(shared.root, web.root, 'text-sm text-foreground-muted')}
  >
    <Typography variant="body" color="muted" as="span">
      {label}
    </Typography>
    <span aria-hidden>&#9656;</span>
  </button>
)
