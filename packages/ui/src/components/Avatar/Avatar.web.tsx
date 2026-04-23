import { useState } from 'react'

import { cn } from '../../lib/cn'

import type { IAvatarProps } from './Avatar'
import type { CSSProperties } from 'react'

/** Web implementation of the Avatar component. */
export const Avatar = ({ src, name, size = 40 }: IAvatarProps) => {
  const [hasError, setHasError] = useState(false)
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
        'inline-flex items-center justify-center rounded-full bg-grey-300 text-xs font-bold text-grey-900',
        'w-[var(--avatar-size)] h-[var(--avatar-size)]'
      )}
      style={sizeStyle}
      role="img"
      aria-label={name}
    >
      {initials}
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
