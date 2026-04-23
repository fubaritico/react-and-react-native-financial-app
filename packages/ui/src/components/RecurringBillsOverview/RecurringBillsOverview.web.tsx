import { cn } from '../../lib/cn'
import { BillSummaryRow } from '../BillSummaryRow/BillSummaryRow.web'
import { SectionLink } from '../SectionLink/SectionLink.web'
import { Typography } from '../Typography/Typography.web'

import styles from './RecurringBillsOverview.styles'

import type { IRecurringBillsOverviewProps } from './RecurringBillsOverview'

/** Web implementation of the RecurringBillsOverview section component. */
export const RecurringBillsOverview = ({
  paid,
  upcoming,
  dueSoon,
  onSeeDetails,
}: IRecurringBillsOverviewProps) => (
  <section className={styles.root}>
    <div className={cn('flex', styles.header)}>
      <Typography variant="subsection-title" as="h3">
        Recurring Bills
      </Typography>
      <SectionLink label="See Details" onPress={onSeeDetails} />
    </div>
    <div className={cn('flex flex-col', styles.list)}>
      <BillSummaryRow label="Paid Bills" amount={paid} color="green" />
      <BillSummaryRow label="Total Upcoming" amount={upcoming} color="yellow" />
      <BillSummaryRow label="Due Soon" amount={dueSoon} color="cyan" />
    </div>
  </section>
)
