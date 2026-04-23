import { View } from 'react-native'

import tw from '../../lib/tw'
import { BillSummaryRow } from '../BillSummaryRow/BillSummaryRow.native'
import { SectionLink } from '../SectionLink/SectionLink.native'
import { Typography } from '../Typography/Typography.native'

import styles from './RecurringBillsOverview.styles'

import type { IRecurringBillsOverviewProps } from './RecurringBillsOverview'

/** Native implementation of the RecurringBillsOverview section component. */
export const RecurringBillsOverview = ({
  paid,
  upcoming,
  dueSoon,
  onSeeDetails,
}: IRecurringBillsOverviewProps) => (
  <View style={tw`${styles.root}`}>
    <View style={tw`${styles.header}`}>
      <Typography variant="subsection-title" accessibilityRole="header">
        Recurring Bills
      </Typography>
      <SectionLink label="See Details" onPress={onSeeDetails} />
    </View>
    <View style={tw`${styles.list}`}>
      <BillSummaryRow label="Paid Bills" amount={paid} color="green" />
      <BillSummaryRow label="Total Upcoming" amount={upcoming} color="yellow" />
      <BillSummaryRow label="Due Soon" amount={dueSoon} color="cyan" />
    </View>
  </View>
)
