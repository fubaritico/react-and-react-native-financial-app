import { BillSummaryRow } from '../BillSummaryRow/BillSummaryRow.web'
import { SectionLink } from '../SectionLink/SectionLink.web'

import type { IRecurringBillsOverviewProps } from './RecurringBillsOverview'

/** Web implementation of the RecurringBillsOverview section component. */
export const RecurringBillsOverview = ({
  paid,
  upcoming,
  dueSoon,
  onSeeDetails,
}: IRecurringBillsOverviewProps) => (
  <section>
    <div className="flex flex-row justify-between items-center">
      <h3 className="text-base font-bold text-grey-900">Recurring Bills</h3>
      <SectionLink label="See Details" onPress={onSeeDetails} />
    </div>
    <div className="bg-white rounded-xl p-5 mt-3 flex flex-col gap-3">
      <BillSummaryRow label="Paid Bills" amount={paid} color="green" />
      <BillSummaryRow label="Total Upcoming" amount={upcoming} color="yellow" />
      <BillSummaryRow label="Due Soon" amount={dueSoon} color="cyan" />
    </div>
  </section>
)
