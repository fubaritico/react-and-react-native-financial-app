import {
  PotAmountFormContent,
  PotFormContent,
  useDeleteBodyRenderer,
  useFeedbackModals,
  usePotCrud,
} from '@financial-app/features'
import { getPotsOptions } from '@financial-app/http-client'
import { getErrorMessage, useModal } from '@financial-app/shared'
import { Alert, Button, Spinner, Typography } from '@financial-app/ui'
import { HydrationBoundary, dehydrate, useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type {
  IPotAmountFormRef,
  IPotFormAccessor,
  PotFormValues,
} from '@financial-app/features'
import type { Pot } from '@financial-app/http-client'

import PotCardItem from '../components/PotCardItem'
import { createServerQueryClient } from '../lib/query-client.server'
import { skipServerHop } from '../lib/skip-server-hop'
import { useFormAccessor } from '../lib/use-form-accessor'
import { potsQuery } from '../queries'

import type { Route } from './+types/pots'

/** @returns Prefetched pots data via server-side dehydration. */
export async function loader() {
  const queryClient = createServerQueryClient()

  await potsQuery(queryClient)

  return { dehydratedState: dehydrate(queryClient) }
}

/** Client-navigation loader — skips the server hop; useQuery drives data client-side. */
export const clientLoader = skipServerHop

/**
 * @param props - Route component props including the dehydrated query state
 * @returns Pots page with pot cards and CRUD modals
 */
export default function Pots({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const modal = useModal()
  const formRef = useRef<HTMLFormElement>(null)
  const amountRef = useRef<IPotAmountFormRef>(null)

  const { data: pots, error, isLoading } = useQuery(getPotsOptions())

  const { getFormData, hasErrors, triggerValidation } =
    useFormAccessor<PotFormValues>(formRef)

  const formAccessor: IPotFormAccessor = useMemo(
    () => ({ getFormData, hasErrors, triggerValidation }),
    [getFormData, hasErrors, triggerValidation]
  )

  const { showSuccess, showError } = useFeedbackModals(modal)
  const { renderDeleteBody } = useDeleteBodyRenderer()

  /** @param count - Remaining characters for pot name */
  const getCharsLeftLabel = useCallback(
    (count: number) => t('pots.form.charactersLeft', { count }),
    [t]
  )

  /**
   * Renders the pot form with the web form ref.
   * @param props - Optional initial values and description to prefill the form
   * @returns The PotFormContent element
   */
  const renderForm = useCallback(
    (props?: { initialValues?: PotFormValues; description?: string }) => (
      <PotFormContent
        ref={formRef}
        initialValues={props?.initialValues}
        nameLabel={t('pots.form.nameLabel')}
        namePlaceholder={t('pots.form.namePlaceholder')}
        targetLabel={t('pots.form.targetLabel')}
        targetPlaceholder={t('pots.form.targetPlaceholder')}
        themeLabel={t('pots.form.themeLabel')}
        charactersLeftLabel={getCharsLeftLabel}
        alreadyUsedLabel={t('pots.form.alreadyUsed')}
        description={props?.description}
      />
    ),
    [t, getCharsLeftLabel]
  )

  /**
   * Renders the amount form for add money / withdraw modals.
   * @param pot - The pot for which to render the amount form
   * @param mode - Whether adding or withdrawing money
   * @returns The PotAmountFormContent element
   */
  const renderAmountForm = useCallback(
    (pot: Pot, mode: 'add' | 'withdraw') => (
      <PotAmountFormContent
        ref={amountRef}
        currentTotal={pot.total}
        target={pot.target}
        mode={mode}
        newAmountLabel={t(
          mode === 'add'
            ? 'pots.addMoneyModal.newAmountLabel'
            : 'pots.withdrawModal.newAmountLabel'
        )}
        targetOfLabel={t('pots.targetOf')}
        amountLabel={t(
          mode === 'add'
            ? 'pots.addMoneyModal.amountLabel'
            : 'pots.withdrawModal.amountLabel'
        )}
        amountPlaceholder={t(
          mode === 'add'
            ? 'pots.addMoneyModal.amountPlaceholder'
            : 'pots.withdrawModal.amountPlaceholder'
        )}
      />
    ),
    [t]
  )

  /**
   * Reads the current amount from the amount-form ref.
   * @returns The current amount, or 0 if the ref is not yet attached
   */
  const getAmount = useCallback(() => amountRef.current?.getAmount() ?? 0, [])

  const {
    handleAdd,
    handleEdit,
    handleDelete,
    handleAddMoney,
    handleWithdraw,
  } = usePotCrud({
    modal,
    formAccessor,
    showSuccess,
    showError,
    renderForm,
    renderDeleteBody,
    renderAmountForm,
    getAmount,
  })

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center min-h-screen justify-center p-6 lg:p-10">
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
    <HydrationBoundary state={loaderData.dehydratedState}>
      <div className="p-6 lg:p-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Typography variant="page-title" as="h1">
            {t('pots.title')}
          </Typography>
          <Button
            title={t('pots.addNewPot')}
            onPress={handleAdd}
            size="lg"
            variant="primary"
          />
        </div>

        {/* 2-col grid when content area >= 1100px */}
        <div className="grid grid-cols-1 gap-6 @[1100px]:grid-cols-2">
          {(pots ?? []).map((pot) => (
            <PotCardItem
              key={pot.id}
              pot={pot}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddMoney={handleAddMoney}
              onWithdraw={handleWithdraw}
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
    </HydrationBoundary>
  )
}
