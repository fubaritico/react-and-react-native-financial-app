import {
  PotAmountFormContent,
  PotCard,
  PotFormContent,
  createAddMoneyModalConfig,
  createAddPotModalConfig,
  createDeletePotModalConfig,
  createEditPotModalConfig,
  createWithdrawModalConfig,
} from '@financial-app/features'
import {
  deletePotsByIdMutation,
  getPotsOptions,
  postPotsByIdAddMutation,
  postPotsByIdWithdrawMutation,
  postPotsMutation,
  putPotsByIdMutation,
} from '@financial-app/http-client'
import { getErrorMessage, useModal } from '@financial-app/shared'
import { Alert, Button, Spinner, Typography } from '@financial-app/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import type { IPotAmountFormRef, IPotFormRef } from '@financial-app/features'
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

export default function PotsScreen() {
  const { t } = useTranslation()
  const modal = useModal()
  const qc = useQueryClient()
  const formRef = useRef<IPotFormRef>(null)
  const amountRef = useRef<IPotAmountFormRef>(null)

  const potsOpts = getPotsOptions()
  const { data: pots, isLoading, error } = useQuery(potsOpts)

  /** ID of the pot currently being edited (stable ref to avoid stale closures) */
  const editingPotIdRef = useRef<string | null>(null)

  const { mutate: createPot } = useMutation({
    ...postPotsMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: potsOpts.queryKey })
      modal.close()
    },
  })

  const { mutate: updatePot } = useMutation({
    ...putPotsByIdMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: potsOpts.queryKey })
      modal.close()
    },
  })

  const { mutate: deletePot } = useMutation({
    ...deletePotsByIdMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: potsOpts.queryKey })
      modal.close()
    },
  })

  const { mutate: addMoney } = useMutation({
    ...postPotsByIdAddMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: potsOpts.queryKey })
      modal.close()
    },
  })

  const { mutate: withdrawMoney } = useMutation({
    ...postPotsByIdWithdrawMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: potsOpts.queryKey })
      modal.close()
    },
  })

  const handleSubmitPot = useCallback(() => {
    const values = formRef.current?.getValues()
    if (!values) return
    const parsed = Number(values.target)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    if (!values.name.trim()) return
    createPot({
      body: {
        name: values.name.trim(),
        target: parsed,
        theme: values.theme,
      },
    })
  }, [createPot])

  const handleSubmitEditPot = useCallback(() => {
    const values = formRef.current?.getValues()
    const potId = editingPotIdRef.current
    if (!values || !potId) return
    const parsed = Number(values.target)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    if (!values.name.trim()) return
    updatePot({
      path: { id: potId },
      body: {
        name: values.name.trim(),
        target: parsed,
        theme: values.theme,
      },
    })
  }, [updatePot])

  const handleAddPot = useCallback(() => {
    const config = createAddPotModalConfig(
      <PotFormContent
        ref={formRef}
        nameLabel={t('pots.form.nameLabel')}
        namePlaceholder={t('pots.form.namePlaceholder')}
        targetLabel={t('pots.form.targetLabel')}
        targetPlaceholder={t('pots.form.targetPlaceholder')}
        themeLabel={t('pots.form.themeLabel')}
        charactersLeftLabel={(count) =>
          t('pots.form.charactersLeft', { count })
        }
        description={t('pots.addModal.description')}
      />,
      handleSubmitPot,
      {
        title: t('pots.addModal.title'),
        submitLabel: t('pots.addModal.submitLabel'),
      }
    )
    modal.open(config)
  }, [t, modal, handleSubmitPot])

  /** Opens the Edit Pot modal for the given pot */
  const handleEditPot = useCallback(
    (pot: Pot) => {
      editingPotIdRef.current = pot.id
      const config = createEditPotModalConfig(
        <PotFormContent
          ref={formRef}
          initialValues={{
            name: pot.name,
            target: String(pot.target),
            theme: pot.theme,
          }}
          nameLabel={t('pots.form.nameLabel')}
          namePlaceholder={t('pots.form.namePlaceholder')}
          targetLabel={t('pots.form.targetLabel')}
          targetPlaceholder={t('pots.form.targetPlaceholder')}
          themeLabel={t('pots.form.themeLabel')}
          charactersLeftLabel={(count) =>
            t('pots.form.charactersLeft', { count })
          }
          description={t('pots.editModal.description')}
        />,
        handleSubmitEditPot,
        {
          title: t('pots.editModal.title'),
          submitLabel: t('pots.editModal.submitLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, handleSubmitEditPot]
  )

  /** Opens the Delete Pot confirmation modal for the given pot */
  const handleDeletePot = useCallback(
    (pot: Pot) => {
      const config = createDeletePotModalConfig(
        pot.name,
        <Typography variant="body" color="muted">
          {t('pots.deleteModal.description')}
        </Typography>,
        () => {
          deletePot({ path: { id: pot.id } })
        },
        {
          title: (name) => t('pots.deleteModal.title', { name }),
          confirmLabel: t('pots.deleteModal.confirmLabel'),
          cancelLabel: t('pots.deleteModal.cancelLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, deletePot]
  )

  /** Opens the Add Money modal for the given pot */
  const handleAddMoney = useCallback(
    (pot: Pot) => {
      const handleSubmit = () => {
        const amount = amountRef.current?.getAmount() ?? 0
        if (amount <= 0) return
        addMoney({ path: { id: pot.id }, body: { amount } })
      }
      const config = createAddMoneyModalConfig(
        pot.name,
        <PotAmountFormContent
          ref={amountRef}
          currentTotal={pot.total}
          target={pot.target}
          mode="add"
          newAmountLabel={t('pots.addMoneyModal.newAmountLabel')}
          targetOfLabel={t('pots.targetOf')}
          amountLabel={t('pots.addMoneyModal.amountLabel')}
          amountPlaceholder={t('pots.addMoneyModal.amountPlaceholder')}
        />,
        handleSubmit,
        {
          title: (name) => t('pots.addMoneyModal.title', { name }),
          submitLabel: t('pots.addMoneyModal.submitLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, addMoney]
  )

  /** Opens the Withdraw modal for the given pot */
  const handleWithdraw = useCallback(
    (pot: Pot) => {
      const handleSubmit = () => {
        const amount = amountRef.current?.getAmount() ?? 0
        if (amount <= 0) return
        withdrawMoney({ path: { id: pot.id }, body: { amount } })
      }
      const config = createWithdrawModalConfig(
        pot.name,
        <PotAmountFormContent
          ref={amountRef}
          currentTotal={pot.total}
          target={pot.target}
          mode="withdraw"
          newAmountLabel={t('pots.withdrawModal.newAmountLabel')}
          targetOfLabel={t('pots.targetOf')}
          amountLabel={t('pots.withdrawModal.amountLabel')}
          amountPlaceholder={t('pots.withdrawModal.amountPlaceholder')}
        />,
        handleSubmit,
        {
          title: (name) => t('pots.withdrawModal.title', { name }),
          submitLabel: t('pots.withdrawModal.submitLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, withdrawMoney]
  )

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-beige-100`}>
        <Spinner />
      </View>
    )
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-beige-100 px-6 justify-center`}>
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
      style={tw`flex-1 bg-beige-100`}
      contentContainerStyle={tw`p-4 pb-8`}
    >
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-6 mt-10`}>
        <Typography variant="page-title">{t('pots.title')}</Typography>
        <Button
          title={t('pots.addNewPot')}
          onPress={handleAddPot}
          variant="primary"
        />
      </View>

      {/* Pot Cards */}
      {(pots ?? []).map((pot) => (
        <View key={pot.id} style={tw`mt-4`}>
          <PotCardItem
            pot={pot}
            onEdit={handleEditPot}
            onDelete={handleDeletePot}
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
