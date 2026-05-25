import { iconData } from '@financial-app/icons'

import { SEMANTIC_COLORS } from '#Lib/semanticColors'

import { iconSizeMap } from './Icon.constants'

import type { IIconProps } from './Icon'
import type { SVGProps } from 'react'

/** Web-specific props passed through to the svg element */
type IIconWebProps = IIconProps &
  Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'>

/**
 * Resolves semantic color token to a CSS value.
 * @param color - Semantic token name or 'currentColor'
 * @returns CSS color value
 */
function resolveCssColor(color: IIconProps['color']): string {
  if (!color || color === 'currentColor') return 'currentColor'
  const token = SEMANTIC_COLORS[color]
  if (token === 'inherit') return 'currentColor'
  return `var(--color-${token})`
}

/**
 * Compute rendered width and height.
 * Without iconSize: uses the viewBox natural dimensions.
 * With iconSize: applies the pixel value to the largest dimension,
 * scales the other proportionally to preserve aspect ratio.
 */
function computeDimensions(
  iconSize: IIconWebProps['iconSize'],
  naturalW: number,
  naturalH: number
) {
  if (!iconSize) return { width: naturalW, height: naturalH }

  const px = iconSizeMap[iconSize]
  if (naturalW >= naturalH) {
    return { width: px, height: Math.round((naturalH / naturalW) * px) }
  }
  return { width: Math.round((naturalW / naturalH) * px), height: px }
}

/** Web implementation of the Icon component. */
export function Icon({
  name,
  iconSize,
  color = 'currentColor',
  accessibilityLabel,
  ...rest
}: Readonly<IIconWebProps>) {
  const icon = iconData[name]
  const { width, height } = computeDimensions(iconSize, icon.width, icon.height)
  const fill = resolveCssColor(color)

  return (
    <svg
      viewBox={icon.viewBox}
      width={width}
      height={height}
      fill="none"
      aria-hidden={!accessibilityLabel}
      aria-label={accessibilityLabel}
      role={accessibilityLabel ? 'img' : undefined}
      {...rest}
    >
      {icon.elements.map((el, i) => {
        if ('type' in el && el.type === 'circle') {
          return <circle key={i} cx={el.cx} cy={el.cy} r={el.r} fill={fill} />
        }

        if ('type' in el && el.type === 'rect') {
          return (
            <rect
              key={i}
              x={el.x}
              y={el.y}
              width={el.width}
              height={el.height}
              rx={el.rx}
              ry={el.ry}
              fill={fill}
            />
          )
        }

        return (
          <path
            key={i}
            d={el.d}
            fill={fill}
            fillRule={el.fillRule as SVGProps<SVGPathElement>['fillRule']}
            clipRule={el.clipRule as SVGProps<SVGPathElement>['clipRule']}
            strokeWidth={el.strokeWidth}
            strokeLinecap={
              el.strokeLinecap as SVGProps<SVGPathElement>['strokeLinecap']
            }
            strokeLinejoin={
              el.strokeLinejoin as SVGProps<SVGPathElement>['strokeLinejoin']
            }
          />
        )
      })}
    </svg>
  )
}
