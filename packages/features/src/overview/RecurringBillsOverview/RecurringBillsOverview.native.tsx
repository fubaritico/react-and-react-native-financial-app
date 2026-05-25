import {
  BillSummaryRow,
  Card,
  Icon,
  SectionLink,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { shared } from './RecurringBillsOverview.styles'

import type { IRecurringBillsOverviewProps } from './RecurringBillsOverview'

/**
 * Native implementation of the RecurringBillsOverview section component.
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
    <Card>
      <View style={tw`${shared.header}`}>
        <Typography variant="subsection-title" accessibilityRole="header">
          {title}
        </Typography>
        <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
      </View>
      {isEmpty ? (
        <Pressable
          onPress={onSeeDetails}
          accessibilityRole="button"
          accessibilityLabel={seeDetailsLabel}
          accessibilityState={{ disabled: false }}
        >
          <View style={tw`${shared.noData}`}>
            <Icon name="navRecurringBills" iconSize="5xl" color="muted" />
            <Typography variant="body" color="muted" align="center">
              {t('recurringBillsOverview.empty')}
            </Typography>
          </View>
        </Pressable>
      ) : (
        <View style={tw`${shared.list}`}>
          <BillSummaryRow label={paidBillsLabel} amount={paid} color="green" />
          <BillSummaryRow
            label={totalUpcomingLabel}
            amount={upcoming}
            color="yellow"
          />
          <BillSummaryRow label={dueSoonLabel} amount={dueSoon} color="cyan" />
        </View>
      )}
    </Card>
  )
}
