import { cn } from '#Lib/cn'

import { Icon, Typography } from '#Atoms/index.web'

import { MEDALLION_OFFSET, MEDALLION_SIZE } from './ModeCard.constants'
import { shared, web } from './ModeCard.styles'
import { modeCardVariants } from './ModeCard.variants'

import type { IModeCardProps } from './ModeCard'

/**
 * Mode selection card with a medallion icon straddling the top edge.
 * @param props - Mode card props
 * @returns A button-styled card for mode selection
 */
export function ModeCard({
  icon,
  title,
  description,
  disabled,
  badge,
  onPress,
}: Readonly<IModeCardProps>) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onPress}
      aria-disabled={disabled ?? undefined}
      className={cn(
        modeCardVariants({ disabled: disabled ?? undefined }),
        shared.root,
        web.root,
        disabled && web.rootDisabled
      )}
    >
      {/* Medallion */}
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 flex',
          shared.medallion
        )}
        style={{
          width: MEDALLION_SIZE,
          height: MEDALLION_SIZE,
          top: -MEDALLION_OFFSET,
        }}
      >
        <Icon name={icon} iconSize="6xl" />
      </div>

      {/* Body */}
      <div className={cn('flex flex-col', shared.body)}>
        <Typography variant="heading-md" as="h3" align="center">
          {title}
        </Typography>
        <Typography
          variant="body"
          color="muted"
          as="p"
          align="center"
          className={shared.description}
        >
          {description}
        </Typography>
        {badge ? (
          <span className={shared.badge}>
            <Typography variant="caption" color="muted" as="span">
              {badge}
            </Typography>
          </span>
        ) : null}
      </div>
    </button>
  )
}
