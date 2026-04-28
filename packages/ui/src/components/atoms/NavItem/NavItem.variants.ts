import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the NavItem component — controls active state, layout orientation, and border accent */
export const navItemVariants = cva('items-center', {
  variants: {
    /** Whether this nav item is currently active/selected */
    active: {
      true: 'bg-nav-active-bg text-nav-active-text',
      false: 'text-nav-text',
    },
    /** Item layout: 'row' for sidebar (icon left of label), 'column' for bottom bar (icon above label) */
    orientation: {
      row: 'flex-row gap-4 px-8 py-4 rounded-r-lg border-l-4',
      column:
        'flex-col gap-1 py-3 rounded-t-lg border-b-4 flex-1 justify-center',
    },
    collapsed: {
      true: 'border-l-0 w-[54px] rounded-lg p-0 justify-center',
      false: 'text-nav-text',
    },
  },
  compoundVariants: [
    { active: true, orientation: 'row', className: 'border-l-nav-accent' },
    {
      active: true,
      orientation: 'column',
      className: 'border-b-nav-accent',
    },
    {
      active: false,
      orientation: 'row',
      className: 'border-l-transparent',
    },
    {
      active: false,
      orientation: 'column',
      className: 'border-b-transparent',
    },
  ],
  defaultVariants: { active: false, orientation: 'row' },
})

export type NavItemVariants = VariantProps<typeof navItemVariants>
