import {
  BillSummaryRow,
  Card,
  Icon,
  SectionLink,
  Typography,
  cn,
} from '@financial-app/ui'
import { useTranslation } from 'react-i18next'

import { shared } from './RecurringBillsOverview.styles'

import type { IRecurringBillsOverviewProps } from './RecurringBillsOverview'

/**
 * Web implementation of the RecurringBillsOverview section component.
 * @param props - Recurring bills overview data and callbacks
 * @returns The recurring bills overview card
 */
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
  const { t } = useTranslation()
  const isEmpty = paid === 0 && upcoming === 0 && dueSoon === 0

  return (
    <Card shadow>
      <div className={cn('flex', shared.header)}>
        <Typography variant="subsection-title" as="h3">
          {title}
        </Typography>
        <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
      </div>
      {isEmpty ? (
        <button
          className={shared.noDataButton}
          onClick={onSeeDetails}
          aria-label={seeDetailsLabel}
        >
          <div className={shared.noData}>
            <div className="text-foreground-muted">
              <Icon name="navRecurringBills" iconSize="5xl" />
            </div>
            <Typography variant="body" color="muted">
              {t('recurringBillsOverview.empty')}
            </Typography>
          </div>
        </button>
      ) : (
        <div className={cn('flex flex-col', shared.list)}>
          {paid > 0 && (
            <BillSummaryRow
              label={paidBillsLabel}
              amount={paid}
              color="green"
            />
          )}
          {upcoming > 0 && (
            <BillSummaryRow
              label={totalUpcomingLabel}
              amount={upcoming}
              color="yellow"
            />
          )}
          {dueSoon > 0 && (
            <BillSummaryRow
              label={dueSoonLabel}
              amount={dueSoon}
              color="cyan"
            />
          )}
        </div>
      )}
    </Card>
  )
}
