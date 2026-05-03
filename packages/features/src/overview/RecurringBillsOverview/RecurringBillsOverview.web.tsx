import {
  BillSummaryRow,
  Card,
  SectionLink,
  Typography,
  cn,
} from '@financial-app/ui'

import { shared } from './RecurringBillsOverview.styles'

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
    <Card>
      <div className={cn('flex', shared.header)}>
        <Typography variant="subsection-title" as="h3">
          {title}
        </Typography>
        <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
      </div>
      <div className={cn('flex flex-col', shared.list)}>
        <BillSummaryRow label={paidBillsLabel} amount={paid} color="green" />
        <BillSummaryRow
          label={totalUpcomingLabel}
          amount={upcoming}
          color="yellow"
        />
        <BillSummaryRow label={dueSoonLabel} amount={dueSoon} color="cyan" />
      </div>
    </Card>
  )
}
