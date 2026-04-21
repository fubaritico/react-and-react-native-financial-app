/** Props for the Avatar component. */
export interface IAvatarProps {
  /** URL or local path to the avatar image. */
  src: string
  /** Name used for alt text and initials fallback. */
  name: string
  /** Size in pixels. Defaults to 40. */
  size?: number
}
