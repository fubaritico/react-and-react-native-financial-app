import { useCurrency } from '@financial-app/shared'
import { Card, Divider, Typography } from '@financial-app/ui'
import { Fragment } from 'react'

import type { IBillsSummaryProps } from './BillsSummary.tsx'

/** Bills summary card (web). Renders title + divider-separated rows. */
export function BillsSummary({ title, rows }: Readonly<IBillsSummaryProps>) {
  const { format } = useCurrency()

  return (
    <Card shadow>
      <Typography variant="heading-md" as="h2">
        {title}
      </Typography>
      <div className="mt-5 flex flex-col">
        {rows.map((row, index) => (
          <Fragment key={row.label}>
            {index > 0 && <Divider />}
            <div className="flex items-center justify-between py-2">
              <Typography
                variant="caption"
                color={row.color ?? 'muted'}
                as="span"
              >
                {row.label}
              </Typography>
              <Typography variant="caption-bold" color={row.color} as="span">
                {`${String(row.count)} (${format(row.total)})`}
              </Typography>
            </div>
          </Fragment>
        ))}
      </div>
    </Card>
  )
}
