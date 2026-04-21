import type { ISectionLinkProps } from './SectionLink'

/** Web implementation of the SectionLink component. */
export const SectionLink = ({ label, onPress }: ISectionLinkProps) => (
  <button
    onClick={onPress}
    className="inline-flex items-center gap-3 text-sm text-grey-500 hover:text-grey-900 transition-colors cursor-pointer bg-transparent border-0 p-0"
  >
    <span>{label}</span>
    <span aria-hidden>&#9656;</span>
  </button>
)
