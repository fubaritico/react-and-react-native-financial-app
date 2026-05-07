import { PotCard } from '@financial-app/features'
import { getPotsOptions } from '@financial-app/http-client'
import { getErrorMessage } from '@financial-app/shared'
import { Alert, Button, Skeleton, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { queryClient } from '../lib/query-client'

import type { Route } from './+types/pots'

// eslint-disable-next-line @typescript-eslint/no-empty-function -- disabled button, wired in CRUD phase
const noop = () => {}

const potsOpts = getPotsOptions()

export async function clientLoader() {
  return queryClient.ensureQueryData(potsOpts).catch(() => undefined)
}

export function HydrateFallback() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-center justify-between">
        <Skeleton variant="line" width="w-24" height="h-8" />
        <Skeleton variant="rectangle" width="w-32" height="h-10" />
      </div>
      <div className="grid grid-cols-1 gap-6 @[1100px]:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangle" height="h-56" />
        ))}
      </div>
    </div>
  )
}

export default function Pots({
  loaderData: initialData,
}: Route.ComponentProps) {
  const { t } = useTranslation()

  const {
    data: pots,
    error,
    isLoading,
  } = useQuery({
    ...potsOpts,
    initialData,
  })

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 lg:p-10">
        <Typography variant="page-title" as="h1" className="mb-4">
          {t('pots.title')}
        </Typography>
        <Alert
          severity="error"
          message={t('common.errorLoading')}
          description={import.meta.env.DEV ? getErrorMessage(error) : undefined}
        />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Typography variant="page-title" as="h1">
          {t('pots.title')}
        </Typography>
        <Button
          title={t('pots.addNewPot')}
          onPress={noop}
          variant="primary"
          disabled
        />
      </div>

      {/* 2-col grid when content area >= 1100px */}
      <div className="grid grid-cols-1 gap-6 @[1100px]:grid-cols-2">
        {(pots ?? []).map((pot) => (
          <PotCard
            key={pot.id}
            name={pot.name}
            total={pot.total}
            target={pot.target}
            color={pot.theme}
            totalSavedLabel={t('pots.totalSaved')}
            targetOfLabel={t('pots.targetOf')}
            addMoneyLabel={t('pots.addMoney')}
            withdrawLabel={t('pots.withdraw')}
            editLabel={t('pots.editPot')}
            deleteLabel={t('pots.deletePot')}
          />
        ))}
      </div>
    </div>
  )
}
