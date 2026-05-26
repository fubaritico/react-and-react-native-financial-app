import {
  Card,
  ColorBarItem,
  Currency,
  Icon,
  SectionLink,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { shared } from './PotsOverview.styles'

import type { IPotsOverviewProps } from './PotsOverview'

/**
 * Native implementation of the PotsOverview section component.
 * @param props - Pots overview data and callbacks
 * @returns The pots overview card
 */
export const PotsOverview = ({
  title,
  seeDetailsLabel,
  totalSavedLabel,
  savingsIconLabel,
  totalSaved,
  pots,
  onSeeDetails,
  icon,
}: Readonly<IPotsOverviewProps>) => {
  const { t } = useTranslation()

  return (
    <Card shadow>
      {/* Header row */}
      <View style={tw`${shared.header}`}>
        <Typography variant="subsection-title" accessibilityRole="header">
          {title}
        </Typography>
        <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
      </View>

      {/* Content */}
      {pots.length ? (
        <View>
          {/* Total Saved box */}
          <View style={tw`${shared.totalSavedBox}`}>
            {/* Icon area */}
            <View
              accessible
              accessibilityLabel={savingsIconLabel}
              style={tw`${shared.iconArea}`}
            >
              {icon ?? <Icon name="pot" iconSize="5xl" color="green" />}
            </View>

            {/* Total saved text */}
            <View>
              <Typography variant="body" color="muted">
                {totalSavedLabel}
              </Typography>
              <Typography variant="display-lg">
                <Currency>{totalSaved}</Currency>
              </Typography>
            </View>
          </View>

          {/* Pots grid — 2 columns */}
          <View style={tw`flex-row flex-wrap mt-4`}>
            {pots.map((pot) => (
              <View key={pot.name} style={tw`w-1/2 py-2`}>
                <ColorBarItem
                  label={pot.name}
                  amount={pot.total}
                  color={pot.color}
                />
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Pressable
          onPress={onSeeDetails}
          accessibilityRole="button"
          accessibilityLabel={seeDetailsLabel}
          accessibilityState={{ disabled: false }}
        >
          <View style={tw`${shared.noData}`}>
            <Icon name="navPots" iconSize="5xl" color="muted" />
            <Typography variant="body" color="muted" align="center">
              {t('potsOverview.empty')}
            </Typography>
          </View>
        </Pressable>
      )}
    </Card>
  )
}
