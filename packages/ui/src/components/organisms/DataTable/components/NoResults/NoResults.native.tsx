import { View } from 'react-native'

import tw from '../../../../../lib/tw'
import { Typography } from '../../../../atoms/Typography/Typography.native'
import { dataTableStyles } from '../../DataTable.styles'

import type { INoResultsProps } from './NoResults'

/** Empty state placeholder for DataTable (native). */
export function NoResults({ message }: Readonly<INoResultsProps>) {
  return (
    <View style={tw`${dataTableStyles.emptyRow}`}>
      <Typography variant="body" color="muted">
        {message}
      </Typography>
    </View>
  )
}
