import {
  PotAmountFormContent,
  PotCard,
  PotFormContent,
  usePotCrud,
} from '@financial-app/features'
import { getPotsOptions } from '@financial-app/http-client'
import { getErrorMessage, useModal } from '@financial-app/shared'
import { Alert, Button, Skeleton, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type {
  IPotAmountFormRef,
  IPotFormBridge,
  PotFormValues,
} from '@financial-app/features'
import type { Pot } from '@financial-app/http-client'

import { queryClient } from '../lib/query-client'

import type { Route } from './+types/pots'

/** Props for the PotCardItem wrapper */
interface IPotCardItemProps {
  /** Pot data */
  pot: Pot
  /** Callback receiving the pot to edit */
  onEdit: (pot: Pot) => void
  /** Callback receiving the pot to delete */
  onDelete: (pot: Pot) => void
  /** Callback receiving the pot to add money to */
  onAddMoney: (pot: Pot) => void
  /** Callback receiving the pot to withdraw from */
  onWithdraw: (pot: Pot) => void
  /** Label translations */
  totalSavedLabel: string
  targetOfLabel: string
  addMoneyLabel: string
  withdrawLabel: string
  editLabel: string
  deleteLabel: string
}

/** Wrapper that memoizes callbacks per pot (avoids inline arrow in map) */
function PotCardItem({
  pot,
  onEdit,
  onDelete,
  onAddMoney,
  onWithdraw,
  ...labels
}: Readonly<IPotCardItemProps>) {
  const handleEdit = useCallback(() => {
    onEdit(pot)
  }, [pot, onEdit])

  const handleDelete = useCallback(() => {
    onDelete(pot)
  }, [pot, onDelete])

  const handleAddMoney = useCallback(() => {
    onAddMoney(pot)
  }, [pot, onAddMoney])

  const handleWithdraw = useCallback(() => {
    onWithdraw(pot)
  }, [pot, onWithdraw])

  return (
    <PotCard
      name={pot.name}
      total={pot.total}
      target={pot.target}
      color={pot.theme}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAddMoney={handleAddMoney}
      onWithdraw={handleWithdraw}
      {...labels}
    />
  )
}

const potsOpts = getPotsOptions()

/** @returns Prefetched pots data for hydration. */
export async function clientLoader() {
  return queryClient.ensureQueryData(potsOpts).catch(() => undefined)
}

/** @returns Skeleton fallback rendered while clientLoader is in flight. */
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

/** @returns Pots page with pot cards and CRUD modals. */
export default function Pots({
  loaderData: initialData,
}: Route.ComponentProps) {
  const { t } = useTranslation()
  const modal = useModal()
  const formRef = useRef<HTMLFormElement>(null)
  const amountRef = useRef<IPotAmountFormRef>(null)

  const {
    data: pots,
    error,
    isLoading,
  } = useQuery({
    ...potsOpts,
    initialData,
  })

  /** Reads form data from the dataset on the form element */
  const getFormData = useCallback((): PotFormValues | null => {
    const ref = formRef.current
    if (!ref?.dataset.formData) return null
    const data = structuredClone(
      JSON.parse(ref.dataset.formData) as PotFormValues
    )
    delete ref.dataset.formData
    return data
  }, [])

  /** Whether the form has validation errors (dataset-based) */
  const hasFormErrors = useCallback(
    () => formRef.current?.dataset.error === 'true',
    []
  )

  /** Triggers native form validation to show field errors */
  const triggerValidation = useCallback(() => {
    formRef.current?.requestSubmit()
  }, [])

  const formBridge: IPotFormBridge = useMemo(
    () => ({ getFormData, hasErrors: hasFormErrors, triggerValidation }),
    [getFormData, hasFormErrors, triggerValidation]
  )

  /** Opens a brief confirmation modal after a successful mutation */
  const showSuccess = useCallback(
    (message: string) => {
      modal.open({
        body: (
          <Typography
            variant="subsection-title"
            color="foreground"
            className="text-center"
          >
            {message}
          </Typography>
        ),
        actions: [
          {
            label: t('common.ok'),
            variant: 'primary',
            onPress: () => {
              modal.close()
            },
          },
        ],
        dismissable: false,
      })
    },
    [modal, t]
  )

  /** Opens an error modal after a failed mutation */
  const showError = useCallback(
    (err: unknown) => {
      modal.open({
        body: (
          <Typography
            variant="subsection-title"
            color="foreground"
            className="text-center"
          >
            {import.meta.env.DEV
              ? getErrorMessage(err)
              : t('common.somethingWentWrong')}
          </Typography>
        ),
        actions: [
          {
            label: t('common.ok'),
            variant: 'destroy',
            onPress: () => {
              modal.close()
            },
          },
        ],
        dismissable: false,
      })
    },
    [modal, t]
  )

  /** @param count - Remaining characters for pot name */
  const getCharsLeftLabel = useCallback(
    (count: number) => t('pots.form.charactersLeft', { count }),
    [t]
  )

  /** Renders the pot form with web ref */
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

  /** Renders the delete modal body */
  const renderDeleteBody = useCallback(
    (description: string) => (
      <Typography variant="body" color="muted">
        {description}
      </Typography>
    ),
    []
  )

  /**
   * Renders the amount form for add money / withdraw modals.
   * @param pot - The pot for which to render the amount form
   * @param mode - Whether adding or withdrawing money
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

  /** Returns the current amount from the amount form ref */
  const getAmount = useCallback(() => amountRef.current?.getAmount() ?? 0, [])

  const {
    handleAdd,
    handleEdit,
    handleDelete,
    handleAddMoney,
    handleWithdraw,
  } = usePotCrud({
    modal,
    formBridge,
    showSuccess,
    showError,
    renderForm,
    renderDeleteBody,
    renderAmountForm,
    getAmount,
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
  )
}
