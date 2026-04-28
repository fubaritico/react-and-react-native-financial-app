import { cn } from '#Lib/cn'

import { Typography } from '../Typography/Typography.web'

import { shared, web } from './LinkText.styles'

import type { ILinkTextProps } from './LinkText'

/** Web implementation of the LinkText component. */
export const LinkText = ({
  text,
  linkLabel,
  onLinkPress,
}: Readonly<ILinkTextProps>) => (
  <Typography variant="body" color="muted" as="p" className="text-center">
    {text}{' '}
    <button
      type="button"
      onClick={onLinkPress}
      className={cn(shared.link, web.link)}
    >
      {linkLabel}
    </button>
  </Typography>
)
