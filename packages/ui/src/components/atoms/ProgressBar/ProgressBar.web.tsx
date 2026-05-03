import { cn } from '#Lib/cn'

import { shared, web } from './ProgressBar.styles'
import { progressBarVariants } from './ProgressBar.variants'

import type { IProgressBarProps } from './ProgressBar'
import type { CSSProperties } from 'react'

/** Web implementation of the ProgressBar component. */
export function ProgressBar({
  value,
  max = 100,
  color,
  size,
  metaLeft,
  metaRight,
}: Readonly<IProgressBarProps>) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const fillClass = size === 'thin' ? shared.fillThin : shared.fillThick

  return (
    <div>
      <div
        className={cn(progressBarVariants({ size }))}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        style={
          {
            '--progress-color': `var(--color-base-${color}-DEFAULT)`,
          } as CSSProperties
        }
      >
        <div
          className={cn(fillClass, 'bg-[var(--progress-color)]')}
          style={{ width: `${String(percentage)}%` }}
        />
      </div>

      {(metaLeft ?? metaRight) && (
        <div className={cn(web.metaRow, shared.metaRow)}>
          <div>{metaLeft}</div>
          <div>{metaRight}</div>
        </div>
      )}
    </div>
  )
}
