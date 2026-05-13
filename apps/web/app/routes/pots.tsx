import {
  PotCard,
  PotFormContent,
  createAddPotModalConfig,
  createDeletePotModalConfig,
  createEditPotModalConfig,
} from '@financial-app/features'
import {
  deletePotsByIdMutation,
  getPotsOptions,
  postPotsMutation,
  putPotsByIdMutation,
} from '@financial-app/http-client'
import { getErrorMessage, useModal } from '@financial-app/shared'
import { Alert, Button, Skeleton, Spinner, Typography } from '@financial-app/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { IPotFormRef } from '@financial-app/features'
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
  /** Label translations */
  totalSavedLabel: string
  targetOfLabel: string
  addMoneyLabel: string
  withdrawLabel: string
  editLabel: string
  deleteLabel: string
}

/** Wrapper that memoizes the onEdit/onDelete callbacks per pot (avoids inline arrow in map) */
function PotCardItem({
  pot,
  onEdit,
  onDelete,
  ...labels
}: Readonly<IPotCardItemProps>) {
  const handleEdit = useCallback(() => {
    onEdit(pot)
  }, [pot, onEdit])

  const handleDelete = useCallback(() => {
    onDelete(pot)
  }, [pot, onDelete])

  return (
    <PotCard
      name={pot.name}
      total={pot.total}
      target={pot.target}
      color={pot.theme}
      onEdit={handleEdit}
      onDelete={handleDelete}
      {...labels}
    />
  )
}

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
  const modal = useModal()
  const qc = useQueryClient()
  const formRef = useRef<IPotFormRef>(null)

  const {
    data: pots,
    error,
    isLoading,
  } = useQuery({
    ...potsOpts,
    initialData,
  })

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
          onPress={handleAddPot}
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
            onEdit={handleEditPot}
            onDelete={handleDeletePot}
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
