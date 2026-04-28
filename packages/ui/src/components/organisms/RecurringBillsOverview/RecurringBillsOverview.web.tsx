import { cn } from '#Lib/cn'

import { Typography } from '#Atoms/index.web'
import { BillSummaryRow, SectionLink } from '#Molecules/index.web'

import styles from './RecurringBillsOverview.styles'

import type { IRecurringBillsOverviewProps } from './RecurringBillsOverview'

/** Web implementation of the RecurringBillsOverview section component. */
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
}: Readonly<IRecurringBillsOverviewProps>) => {
  return (
    <section className={styles.root}>
      <div className={cn('flex', styles.header)}>
        <Typography variant="subsection-title" as="h3">
          {title}
        </Typography>
        <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
      </div>
      <div className={cn('flex flex-col', styles.list)}>
        <BillSummaryRow label={paidBillsLabel} amount={paid} color="green" />
        <BillSummaryRow
          label={totalUpcomingLabel}
          amount={upcoming}
          color="yellow"
        />
        <BillSummaryRow label={dueSoonLabel} amount={dueSoon} color="cyan" />
      </div>
    </section>
  )
}
