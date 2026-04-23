import { iconData } from '@financial-app/icons'
import Svg, { Circle, Path } from 'react-native-svg'

import tw from '../../../lib/tw'

import { iconSizeMap } from './Icon.constants'

import type { IIconProps } from './Icon'
import type { SvgProps } from 'react-native-svg'

/** Native-specific props passed through to the Svg element */
type IIconNativeProps = IIconProps & Omit<SvgProps, 'width' | 'height'>

const DEFAULT_NATIVE_COLOR = tw.color('foreground') ?? '#201F24'

/**
 * Compute rendered width and height.
 * Without iconSize: uses the viewBox natural dimensions.
 * With iconSize: applies the pixel value to the largest dimension,
 * scales the other proportionally to preserve aspect ratio.
 */
function computeDimensions(
  iconSize: IIconNativeProps['iconSize'],
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

/** Native implementation of the Icon component. */
export function Icon({
  name,
  iconSize,
  color = DEFAULT_NATIVE_COLOR,
  accessibilityLabel,
  ...rest
}: IIconNativeProps) {
  const icon = iconData[name]
  const { width, height } = computeDimensions(iconSize, icon.width, icon.height)

  return (
    <Svg
      viewBox={icon.viewBox}
      width={width}
      height={height}
      fill="none"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      {...rest}
    >
      {icon.elements.map((el, i) => {
        if ('type' in el && el.type === 'circle') {
          return <Circle key={i} cx={el.cx} cy={el.cy} r={el.r} fill={color} />
        }

        return (
          <Path
            key={i}
            d={el.d}
            fill={color}
            fillRule={el.fillRule as 'nonzero' | 'evenodd' | undefined}
            clipRule={el.clipRule as 'nonzero' | 'evenodd' | undefined}
            strokeWidth={el.strokeWidth ? Number(el.strokeWidth) : undefined}
            strokeLinecap={
              el.strokeLinecap as 'butt' | 'round' | 'square' | undefined
            }
            strokeLinejoin={
              el.strokeLinejoin as 'miter' | 'round' | 'bevel' | undefined
            }
          />
        )
      })}
    </Svg>
  )
}
