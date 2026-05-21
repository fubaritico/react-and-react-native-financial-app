import { View } from 'react-native'

import tw from '#Lib/tw'

import { SectionLink } from '#Molecules/SectionLink'

import { shared } from './LatestSpending.styles'

import type { ILatestSpendingProps } from './LatestSpending'

import { Avatar, Divider, Typography } from '#Atoms'

/** Native implementation of the LatestSpending component. */
export function LatestSpending({
  title,
  seeAllLabel,
  onSeeAll,
  items,
  showAvatars = true,
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
            {showAvatars && (
              <Avatar src={item.avatar} name={item.name} size={32} />
            )}
            <Typography variant="body-bold" style={tw`${shared.name}`}>
              {item.name}
            </Typography>
            <View style={tw`${shared.itemRight}`}>
              <Typography variant="body-bold">{item.amount}</Typography>
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
