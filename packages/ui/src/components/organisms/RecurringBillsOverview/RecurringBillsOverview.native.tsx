import { View } from 'react-native'

import tw from '../../../lib/tw'
import { Typography } from '../../atoms/Typography/Typography.native'
import { BillSummaryRow } from '../../molecules/BillSummaryRow/BillSummaryRow.native'
import { SectionLink } from '../../molecules/SectionLink/SectionLink.native'

import styles from './RecurringBillsOverview.styles'

import type { IRecurringBillsOverviewProps } from './RecurringBillsOverview'

/** Native implementation of the RecurringBillsOverview section component. */
export const RecurringBillsOverview = ({
  title,
  seeDetailsLabel,
  paidBillsLabel,
  totalUpcomingLabel,
  dueSoonLabel,
  paid,
  upcoming,
  dueSoon,
  onSeeDetails,
}: IRecurringBillsOverviewProps) => {
  return (
    <View style={tw`${styles.root}`}>
      <View style={tw`${styles.header}`}>
        <Typography variant="subsection-title" accessibilityRole="header">
          {title}
        </Typography>
        <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
      </View>
      <View style={tw`${styles.list}`}>
        <BillSummaryRow label={paidBillsLabel} amount={paid} color="green" />
        <BillSummaryRow
          label={totalUpcomingLabel}
          amount={upcoming}
          color="yellow"
        />
        <BillSummaryRow label={dueSoonLabel} amount={dueSoon} color="cyan" />
      </View>
    </View>
  )
}
