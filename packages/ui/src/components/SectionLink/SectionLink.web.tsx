import { cn } from '../../lib/cn'

import styles from './SectionLink.styles'

import type { ISectionLinkProps } from './SectionLink'

/** Web implementation of the SectionLink component. */
export const SectionLink = ({ label, onPress }: ISectionLinkProps) => (
  <button
    onClick={onPress}
    className={cn(
      'inline-flex items-center gap-3 hover:text-grey-900 transition-colors cursor-pointer bg-transparent border-0 p-0',
      styles.label
    )}
  >
    <span>{label}</span>
    <span aria-hidden>&#9656;</span>
  </button>
)
