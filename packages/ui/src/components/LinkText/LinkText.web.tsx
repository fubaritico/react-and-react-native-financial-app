import { cn } from '../../lib/cn'
import { Typography } from '../Typography/Typography.web'

import type { ILinkTextProps } from './LinkText'

/** Web implementation of the LinkText component. */
export const LinkText = ({ text, linkLabel, onLinkPress }: ILinkTextProps) => (
  <Typography variant="body" color="muted" as="p" className="text-center">
    {text}{' '}
    <button
      type="button"
      onClick={onLinkPress}
      className={cn(
        'font-bold text-foreground underline',
        'hover:opacity-80 transition-opacity cursor-pointer'
      )}
    >
      {linkLabel}
    </button>
  </Typography>
)
