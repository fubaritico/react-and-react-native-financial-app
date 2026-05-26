import { cn } from '#Lib/cn'

import { Icon, Typography } from '#Atoms/index.web'

import { CIRCLE_SIZE } from './CategoryButton.constants'
import { shared, web } from './CategoryButton.styles'

import type { ICategoryButtonProps } from './CategoryButton'
import type { CSSProperties } from 'react'

/**
 * Web implementation of the CategoryButton — grey cell with colored circle, icon,
 * name label, and hover-to-delete behaviour.
 * @param props - Category button props
 * @returns A grey cell containing the colored circle + name below
 */
export function CategoryButton({
  id,
  icon,
  color,
  name,
  accessibilityLabel,
  isDeletable,
  onDelete,
  isDeleting,
}: Readonly<ICategoryButtonProps>) {
  const circleStyle: CSSProperties = {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    backgroundColor: `var(--color-${color})`,
  }

  const iconElement = <Icon name={icon} iconSize="xl" color="on-dark" />

  if (isDeletable) {
    return (
      <button
        type="button"
        className={cn(web.cell, web.cellInteractive, 'group')}
        onClick={
          id && onDelete
            ? () => {
                onDelete(id)
              }
            : undefined
        }
        disabled={isDeleting}
        aria-label={accessibilityLabel}
      >
        <div className="relative inline-flex">
          <div className={cn(shared.circle)} style={circleStyle}>
            {iconElement}
          </div>
          <div
            className={cn(
              web.badge,
              isDeleting ? web.badgeVisible : web.badgeHover
            )}
            aria-hidden="true"
          >
            <Icon name="cross" iconSize="4xs" color="on-dark" />
          </div>
        </div>
        <Typography variant="caption" className={web.label} as="span">
          {name}
        </Typography>
      </button>
    )
  }

  return (
    <div
      className={cn(web.cell, web.cellStatic)}
      role="img"
      aria-label={accessibilityLabel}
    >
      <div className={cn(shared.circle)} style={circleStyle}>
        {iconElement}
      </div>
      <Typography variant="caption" className={web.label} as="p">
        {name}
      </Typography>
    </div>
  )
}
