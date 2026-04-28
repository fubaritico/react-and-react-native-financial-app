import { useState } from 'react'

import { cn } from '#Lib/cn'

import { Typography } from '../Typography/Typography.web'

import type { IAvatarProps } from './Avatar'
import type { CSSProperties } from 'react'

/** Returns true when src looks like a loadable URL (absolute or data URI). */
function isValidImageSrc(src: string): boolean {
  return (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:')
  )
}

/** Web implementation of the Avatar component. */
export const Avatar = ({ src, name, size = 40 }: Readonly<IAvatarProps>) => {
  const [hasError, setHasError] = useState(() => !isValidImageSrc(src))
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const sizeStyle = { '--avatar-size': `${String(size)}px` } as CSSProperties

  return hasError ? (
    <span
      className={cn(
        'flex items-center justify-center rounded-full bg-foreground-subtle shrink-0',
        'w-[var(--avatar-size)] h-[var(--avatar-size)]'
      )}
      style={sizeStyle}
      role="img"
      aria-label={name}
    >
      <Typography variant="label" as="span">
        {initials}
      </Typography>
    </span>
  ) : (
    <img
      src={src}
      alt={name}
      onError={() => {
        setHasError(true)
      }}
      className="rounded-full object-cover w-[var(--avatar-size)] h-[var(--avatar-size)]"
      style={sizeStyle}
    />
  )
}
