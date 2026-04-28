import { View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from '../../DataTable.styles'

import type { INoResultsProps } from './NoResults'

import { Typography } from '#Atoms'

/** Empty state placeholder for DataTable (native). */
export function NoResults({ message }: Readonly<INoResultsProps>) {
  return (
    <View style={tw`${shared.emptyRow}`}>
      <Typography variant="body" color="muted">
        {message}
      </Typography>
    </View>
  )
}
