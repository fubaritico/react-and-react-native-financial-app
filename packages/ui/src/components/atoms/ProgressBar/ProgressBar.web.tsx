import { cn } from '#Lib/cn'

import { shared, web } from './ProgressBar.styles'
import { progressBarVariants } from './ProgressBar.variants'

import type { IProgressBarProps } from './ProgressBar'
import type { CSSProperties } from 'react'

/** Color map for buffer intent → CSS variable reference */
const BUFFER_COLOR_MAP = {
  success: 'var(--color-success)',
  destructive: 'var(--color-destructive)',
} as const

/** Web implementation of the ProgressBar component. */
export function ProgressBar({
  value,
  max = 100,
  color,
  buffer,
  bufferColor = 'success',
  size,
  metaLeft,
  metaRight,
}: Readonly<IProgressBarProps>) {
  const clampedValue = Math.min(Math.max(value, 0), max)
  const primaryPct = (clampedValue / max) * 100
  const hasBuffer = buffer != null && buffer > 0
  const bufferPct = hasBuffer
    ? Math.min((buffer / max) * 100, 100 - primaryPct)
    : 0

  const fillClass = hasBuffer
    ? size === 'thin'
      ? shared.fillThinPrimaryWithBuffer
      : shared.fillThickPrimaryWithBuffer
    : size === 'thin'
      ? shared.fillThin
      : shared.fillThick

  const bufferFillClass =
    size === 'thin' ? shared.fillThinBuffer : shared.fillThickBuffer

  return (
    <div>
      <div
        className={cn(progressBarVariants({ size }))}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        style={
          {
            '--progress-color': `var(--color-base-${color}-DEFAULT, var(--color-base-${color}))`,
          } as CSSProperties
        }
      >
        {hasBuffer ? (
          <div className={cn(web.fillRow, shared.fillRow)}>
            <div
              className={cn(fillClass, { 'mr-0': primaryPct === 0 })}
              style={{
                width: `${String(primaryPct)}%`,
                backgroundColor: `var(--color-base-${color}-DEFAULT, var(--color-base-${color}))`,
              }}
            />
            <div
              className={bufferFillClass}
              style={{
                width: `${String(bufferPct)}%`,
                backgroundColor: BUFFER_COLOR_MAP[bufferColor],
              }}
            />
          </div>
        ) : (
          <div
            className={cn(fillClass, 'bg-[var(--progress-color)]')}
            style={{ width: `${String(primaryPct)}%` }}
          />
        )}
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
