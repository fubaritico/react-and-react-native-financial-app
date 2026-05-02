import { cn } from '#Lib/cn'

import { Button, Icon, Typography } from '#Atoms/index.web'

import { useBottomSheetContext } from './BottomSheetContext'

import type { IBottomSheetHeaderProps } from './BottomSheet'

/**
 * Web BottomSheet.Header — renders children on the left and a close button on the right.
 * Uses design tokens consistent with the current variant.
 */
export function BottomSheetHeader({
  className,
  children,
  closeLabel = 'Close',
}: Readonly<IBottomSheetHeaderProps>) {
  const { variant, onClose } = useBottomSheetContext()
  const isDark = variant === 'dark'

  return (
    <div
      data-name="bottom-sheet-header"
      className={cn(
        'flex items-center justify-between px-5 py-3 border-b',
        isDark ? 'border-grey-500' : 'border-border',
        className
      )}
    >
      <div className="flex-1">
        <Typography
          variant="body-bold"
          color={isDark ? 'on-dark' : 'foreground'}
          as="span"
        >
          {children}
        </Typography>
      </div>
      <Button
        variant="tertiary"
        size="sm"
        onPress={onClose}
        accessibilityLabel={closeLabel}
      >
        <Icon name="closeModal" iconSize="md" color="currentColor" />
      </Button>
    </div>
  )
}
