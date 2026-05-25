import { View } from 'react-native'

import tw from '#Lib/tw'

import { SEVERITY_BG, SEVERITY_ICON, SEVERITY_TOKEN } from './Alert.constants'
import { native, shared } from './Alert.styles'
import { alertVariants } from './Alert.variants'

import type { IAlertProps } from './Alert'

import { Icon, Typography } from '#Atoms'

/** Native implementation of the Alert component. */
export function Alert({
  severity,
  message,
  description,
}: Readonly<IAlertProps>) {
  const bgClass = SEVERITY_BG[severity]
  const iconName = SEVERITY_ICON[severity]
  const textColor = SEVERITY_TOKEN[severity]
  const iconColor = SEVERITY_TOKEN[severity]

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      style={tw`${alertVariants()}`}
    >
      {/* Lighter background: white base + colored overlay at 15% opacity */}
      <View style={tw`${native.backdropWhite}`} />
      <View style={tw`${native.backdropColor} ${bgClass}`} />

      {/* Content */}
      <View style={tw`${shared.content} relative`}>
        <Icon name={iconName} iconSize="md" color={iconColor} />
        <View style={tw`flex-1`}>
          <Typography variant="caption" color={textColor}>
            {message}
          </Typography>
          {description ? (
            <Typography variant="caption" color="muted">
              {description}
            </Typography>
          ) : null}
        </View>
      </View>
    </View>
  )
}
