import { cn } from '../../../lib/cn'

import type { IDrawerBodyProps } from './Drawer'

/**
 * Web Drawer.Body — scrollable content area.
 * Fills remaining vertical space and scrolls when content overflows.
 */
export function DrawerBody({ className, children }: IDrawerBodyProps) {
  return (
    <div className={cn('flex flex-1 flex-col overflow-y-auto p-3', className)}>
      {children}
    </div>
  )
}
