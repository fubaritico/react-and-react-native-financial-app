import { cn } from '../../lib/cn'

import styles from './LinkText.styles'

import type { ILinkTextProps } from './LinkText'

/** Web implementation of the LinkText component. */
export const LinkText = ({ text, linkLabel, onLinkPress }: ILinkTextProps) => (
  <p className={cn(styles.text, 'text-center')}>
    {text}{' '}
    <button
      type="button"
      onClick={onLinkPress}
      className={cn(
        styles.linkLabel,
        'hover:opacity-80 transition-opacity cursor-pointer'
      )}
    >
      {linkLabel}
    </button>
  </p>
)
