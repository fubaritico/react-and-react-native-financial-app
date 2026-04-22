import { iconData } from '@financial-app/icons'

import type { IIconProps } from './Icon'
import { iconSizeMap } from './Icon.constants'

/** Web-specific props passed through to the svg element */
type IIconWebProps = IIconProps &
  Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'>

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
}: IIconWebProps) {
  const icon = iconData[name]
  const { width, height } = computeDimensions(iconSize, icon.width, icon.height)

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
          return <circle key={i} cx={el.cx} cy={el.cy} r={el.r} fill={color} />
        }

        return (
          <path
            key={i}
            d={el.d}
            fill={color}
            fillRule={el.fillRule as React.SVGProps<SVGPathElement>['fillRule']}
            clipRule={el.clipRule as React.SVGProps<SVGPathElement>['clipRule']}
            strokeWidth={el.strokeWidth}
            strokeLinecap={
              el.strokeLinecap as React.SVGProps<SVGPathElement>['strokeLinecap']
            }
            strokeLinejoin={
              el.strokeLinejoin as React.SVGProps<SVGPathElement>['strokeLinejoin']
            }
          />
        )
      })}
    </svg>
  )
}
