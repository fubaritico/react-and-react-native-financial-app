import { cn } from '#Lib/cn'

import type { IBottomSheetBodyProps } from './BottomSheet'

/**
 * Web BottomSheet.Body — scrollable content area.
 * Fills remaining vertical space and scrolls when content overflows.
 */
export function BottomSheetBody({
  className,
  children,
}: Readonly<IBottomSheetBodyProps>) {
  return (
    <div
      data-name="bottom-sheet-body"
      className={cn('flex flex-1 flex-col overflow-y-auto p-3', className)}
    >
      {children}
    </div>
  )
}
