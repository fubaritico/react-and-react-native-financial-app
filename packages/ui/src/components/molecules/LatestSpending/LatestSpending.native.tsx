import { View } from 'react-native'

import tw from '#Lib/tw'

import { SectionLink } from '#Molecules/SectionLink'

import { shared } from './LatestSpending.styles'

import type { ILatestSpendingProps } from './LatestSpending'

import { Currency, Divider, Icon, Typography } from '#Atoms'

/** Native implementation of the LatestSpending component. */
export function LatestSpending({
  title,
  seeAllLabel,
  onSeeAll,
  items,
}: Readonly<ILatestSpendingProps>) {
  return (
    <View style={tw`${shared.wrapper}`}>
      <View style={tw`${shared.header}`}>
        <Typography variant="heading-md">{title}</Typography>
        <SectionLink label={seeAllLabel} onPress={onSeeAll} />
      </View>
      {items.map((item, index) => (
        <View key={`${item.name}-${item.date}-${String(index)}`}>
          {index > 0 && <Divider className="bg-grey-500/10" />}
          <View style={tw`${shared.itemRow}`}>
            <View
              style={tw`${shared.iconCircle} bg-${item.categoryColor}`}
              accessibilityRole="image"
              accessibilityLabel={item.name}
            >
              <Icon name={item.categoryIcon} iconSize="xs" color="#FFFFFF" />
            </View>
            <Typography variant="body-bold" style={tw`${shared.name}`}>
              {item.name}
            </Typography>
            <View style={tw`${shared.itemRight}`}>
              <Typography variant="body-bold">
                <Currency sign="auto">{item.amount}</Currency>
              </Typography>
              <Typography
                variant="caption"
                color="muted"
                style={tw`${shared.dateSpacing}`}
              >
                {item.date}
              </Typography>
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}
