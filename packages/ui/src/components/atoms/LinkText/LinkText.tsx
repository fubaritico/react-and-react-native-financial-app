/** Props for the LinkText component. */
export interface ILinkTextProps {
  /** Descriptive text before the link (e.g. "Need to create an account?"). */
  text: string
  /** The clickable link label (e.g. "Sign Up"). */
  linkLabel: string
  /** Callback fired when the link is pressed. */
  onLinkPress: () => void
}
