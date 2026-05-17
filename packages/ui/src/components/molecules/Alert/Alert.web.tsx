import { cn } from '#Lib/cn'

import { Icon } from '#Atoms/index.web'
import { Typography } from '#Atoms/index.web'

import { SEVERITY_BG, SEVERITY_ICON, SEVERITY_TOKEN } from './Alert.constants'
import { shared, web } from './Alert.styles'
import { alertVariants } from './Alert.variants'

import type { IAlertProps } from './Alert'

/** Typography color per severity */
const SEVERITY_TEXT_COLOR = {
  success: 'success',
  warning: 'warning',
  error: 'destructive',
  info: 'blue',
} as const

/** Web implementation of the Alert component. */
export function Alert({
  severity,
  message,
  description,
}: Readonly<IAlertProps>) {
  const bgClass = SEVERITY_BG[severity]
  const iconName = SEVERITY_ICON[severity]
  const textColor = SEVERITY_TEXT_COLOR[severity]
  const iconTextClass = `text-${SEVERITY_TOKEN[severity]}`

  return (
    <div role="alert" aria-live="polite" className={cn(alertVariants())}>
      {/* Lighter background: white base + colored overlay at 15% opacity */}
      <div className={web.backdropWhite} />
      <div className={cn(web.backdropColor, bgClass)} />

      {/* Content — icon inherits color from text class */}
      <div className={cn(shared.content, 'flex relative', iconTextClass)}>
        <Icon name={iconName} iconSize="md" />
        <div>
          <Typography variant="caption" color={textColor} as="span">
            {message}
          </Typography>
          {description ? (
            <Typography variant="caption" color="muted" as="p" className="mt-1">
              {description}
            </Typography>
          ) : null}
        </div>
      </div>
    </div>
  )
}
