import { useCurrency } from '@financial-app/shared'
import { Card, Divider, Typography, tw } from '@financial-app/ui/native'
import { Fragment } from 'react'
import { View } from 'react-native'

import type { IBillsSummaryProps } from './BillsSummary.tsx'

/** Bills summary card (native). Renders title + divider-separated rows. */
export function BillsSummary({ title, rows }: Readonly<IBillsSummaryProps>) {
  const { format } = useCurrency()

  return (
    <Card shadow>
      <Typography variant="heading-md">{title}</Typography>
      <View style={tw`mt-5`}>
        {rows.map((row, index) => (
          <Fragment key={row.label}>
            {index > 0 && <Divider />}
            <View style={tw`flex-row items-center justify-between py-2`}>
              <Typography variant="caption" color={row.color ?? 'muted'}>
                {row.label}
              </Typography>
              <Typography variant="caption-bold" color={row.color}>
                {`${String(row.count)} (${format(row.total)})`}
              </Typography>
            </View>
          </Fragment>
        ))}
      </View>
    </Card>
  )
}
