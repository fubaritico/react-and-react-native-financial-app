import { View } from 'react-native'

import tw from '#Lib/tw'

import { COLOR_MAP, ICON_MAP } from './PasswordRulesList.constants'
import { shared } from './PasswordRulesList.styles'

import type { IPasswordRulesListProps } from './PasswordRulesList'

import { Icon, Typography } from '#Atoms'

/** Native implementation of the PasswordRulesList component. */
export function PasswordRulesList({
  rules,
}: Readonly<IPasswordRulesListProps>) {
  return (
    <View style={tw`${shared.list}`}>
      {rules.map((rule) => (
        <View key={rule.label} style={tw`${shared.row}`}>
          {ICON_MAP[rule.state] ? (
            <View style={tw`${shared.iconWrap}`}>
              <Icon
                name={ICON_MAP[rule.state] as 'paid' | 'dueSoon'}
                iconSize="xxs"
                color={
                  rule.state === 'valid'
                    ? tw.color('success')
                    : tw.color('destructive')
                }
              />
            </View>
          ) : (
            <View style={tw`${shared.iconPlaceholder}`} />
          )}
          <Typography variant="caption" color={COLOR_MAP[rule.state]}>
            {rule.label}
          </Typography>
        </View>
      ))}
    </View>
  )
}
