import type { ILinkTextProps } from './LinkText'

/** Web implementation of the LinkText component. */
export const LinkText = ({ text, linkLabel, onLinkPress }: ILinkTextProps) => (
  <p className="text-sm text-grey-500 text-center">
    {text}{' '}
    <button
      type="button"
      onClick={onLinkPress}
      className="font-bold text-grey-900 underline hover:opacity-80 transition-opacity cursor-pointer"
    >
      {linkLabel}
    </button>
  </p>
)
