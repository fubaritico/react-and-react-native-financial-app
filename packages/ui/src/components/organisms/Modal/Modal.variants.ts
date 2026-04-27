import { cva } from 'class-variance-authority'

/** Modal panel — the white card that contains header, body, footer (560px matches Figma modal width) */
export const modalPanelVariants = cva(
  'bg-white rounded-xl p-5 w-full max-w-[560px]',
  {
    variants: {},
    defaultVariants: {},
  }
)

/** Modal overlay — semi-transparent backdrop behind the panel */
export const modalOverlayVariants = cva('absolute inset-0 bg-black/50', {
  variants: {},
  defaultVariants: {},
})
