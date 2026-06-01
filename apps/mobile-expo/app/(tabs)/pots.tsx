import {
  PotAmountFormContent,
  PotCard,
  PotFormContent,
  useDeleteBodyRenderer,
  useFeedbackModals,
  usePotCrud,
} from '@financial-app/features'
import { getPotsOptions } from '@financial-app/http-client'
import { getErrorMessage, useModal } from '@financial-app/shared'
import { Alert, Button, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import type {
  IPotAmountFormRef,
  IPotFormAccessor,
  IPotFormRef,
  PotFormValues,
} from '@financial-app/features'
import type { Pot } from '@financial-app/http-client'

import tw from '../../src/lib/tw'

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

/** @returns Pots tab screen with pot cards and CRUD modals. */
export default function PotsScreen() {
  const { t } = useTranslation()
  const modal = useModal()
  const formRef = useRef<IPotFormRef>(null)
  const amountRef = useRef<IPotAmountFormRef>(null)

  const potsOpts = getPotsOptions()
  const { data: pots, isLoading, error } = useQuery(potsOpts)

  /** Reads form data from the native imperative ref */
  const getFormData = useCallback(
    (): PotFormValues | null => formRef.current?.getValues() ?? null,
    []
  )

  /** Whether the form has validation errors (ref-based) */
  const hasFormErrors = useCallback(
    () => formRef.current?.hasErrors ?? false,
    []
  )

  /** Triggers full form validation to display all field errors */
  const triggerValidation = useCallback(() => {
    formRef.current?.validate()
  }, [])

  const formAccessor: IPotFormAccessor = useMemo(
    () => ({ getFormData, hasErrors: hasFormErrors, triggerValidation }),
    [getFormData, hasFormErrors, triggerValidation]
  )

  const { showSuccess, showError } = useFeedbackModals(modal)
  const { renderDeleteBody } = useDeleteBodyRenderer()

  /** @param count - Remaining characters for pot name */
  const getCharsLeftLabel = useCallback(
    (count: number) => t('pots.form.charactersLeft', { count }),
    [t]
  )

  /** Renders the pot form with native ref */
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
      <View style={tw`flex-1 bg-beige-200`}>
        <Spinner />
      </View>
    )
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-beige-200 px-6 justify-center`}>
        <Alert
          severity="error"
          message={t('common.errorLoading')}
          description={__DEV__ ? getErrorMessage(error) : undefined}
        />
      </View>
    )
  }

  return (
    <ScrollView
      style={tw`flex-1 bg-beige-200`}
      contentContainerStyle={tw`p-4 pb-8`}
    >
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-6 mt-10`}>
        <Typography variant="page-title">{t('pots.title')}</Typography>
        <Button
          title={t('pots.addNewPot')}
          onPress={handleAdd}
          variant="primary"
        />
      </View>

      {/* Pot Cards */}
      {(pots ?? []).map((pot) => (
        <View key={pot.id} style={tw`mt-4`}>
          <PotCardItem
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
        </View>
      ))}
    </ScrollView>
  )
}
