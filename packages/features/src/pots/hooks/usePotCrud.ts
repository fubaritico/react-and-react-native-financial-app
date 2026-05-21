import {
  deletePotsByIdMutation,
  getPotsOptions,
  postPotsByIdAddMutation,
  postPotsByIdWithdrawMutation,
  postPotsMutation,
  putPotsByIdMutation,
} from '@financial-app/http-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { Pot } from '@financial-app/http-client'
import type { IModalConfig } from '@financial-app/shared'

import {
  createAddMoneyModalConfig,
  createAddPotModalConfig,
  createDeletePotModalConfig,
  createEditPotModalConfig,
  createWithdrawModalConfig,
} from '../createPotModalConfigs'

import type { PotFormValues } from '../PotFormContent/PotFormContent'
import type { ReactNode } from 'react'

/** Platform-specific form access — reads data from web dataset or native imperative ref */
export interface IPotFormBridge {
  /** Returns form values or null if unavailable */
  getFormData: () => PotFormValues | null
  /** Whether the form currently has validation errors */
  hasErrors: () => boolean
  /** Triggers visible validation (web: requestSubmit, native: no-op) */
  triggerValidation: () => void
}

/** Modal control interface (subset of useModal return) */
interface IModalHandle {
  /** Opens a modal with the given config */
  open: (config: IModalConfig) => void
  /** Closes the current modal */
  close: () => void
  /** Sets the submitting state on the current modal */
  setSubmitting: (isSubmitting: boolean) => void
}

/** Params for usePotCrud */
export interface IUsePotCrudParams {
  /** Modal controls from useModal() */
  modal: IModalHandle
  /** Platform-specific form access callbacks */
  formBridge: IPotFormBridge
  /** Called after a successful mutation with the i18n message */
  showSuccess: (message: string) => void
  /** Called after a failed mutation with the error */
  showError: (err: unknown) => void
  /** Renders the pot form component with platform-specific ref and labels */
  renderForm: (props?: {
    initialValues?: PotFormValues
    description?: string
  }) => ReactNode
  /** Renders the delete modal body */
  renderDeleteBody: (description: string) => ReactNode
  /** Renders the amount form for add money / withdraw modals */
  renderAmountForm: (pot: Pot, mode: 'add' | 'withdraw') => ReactNode
  /** Returns the current amount from the amount form ref */
  getAmount: () => number
}

/**
 * Shared CRUD hook for pots — mutations, submit handlers, modal config builders.
 * Platform-agnostic: receives callbacks for form access and JSX rendering.
 *
 * @param params - Modal handle, form bridge, feedback callbacks, render callbacks
 * @returns handleAdd, handleEdit, handleDelete, handleAddMoney, handleWithdraw callbacks
 */
export function usePotCrud({
  modal,
  formBridge,
  showSuccess,
  showError,
  renderForm,
  renderDeleteBody,
  renderAmountForm,
  getAmount,
}: IUsePotCrudParams) {
  const { t } = useTranslation()
  const qc = useQueryClient()

  /** Query options used for invalidation */
  const potsOpts = getPotsOptions()

  /** ID of the pot currently being edited (stable ref to avoid stale closures) */
  const editingIdRef = useRef<string | null>(null)

  /** Invalidates pot queries after mutation */
  const invalidate = useCallback(() => {
    void qc.invalidateQueries({ queryKey: potsOpts.queryKey })
  }, [qc, potsOpts.queryKey])

  const { mutate: createPot } = useMutation({
    ...postPotsMutation(),
    onSuccess: () => {
      invalidate()
      modal.close()
      showSuccess(t('common.potAdded'))
    },
    onError: (err) => {
      modal.close()
      showError(err)
    },
  })

  const { mutate: updatePot } = useMutation({
    ...putPotsByIdMutation(),
    onSuccess: () => {
      invalidate()
      modal.close()
      showSuccess(t('common.potUpdated'))
    },
    onError: (err) => {
      modal.close()
      showError(err)
    },
  })

  const { mutate: deletePot } = useMutation({
    ...deletePotsByIdMutation(),
    onSuccess: () => {
      invalidate()
      modal.close()
      showSuccess(t('common.potDeleted'))
    },
    onError: (err) => {
      modal.close()
      showError(err)
    },
  })

  const { mutate: addMoney } = useMutation({
    ...postPotsByIdAddMutation(),
    onSuccess: () => {
      invalidate()
      modal.close()
      showSuccess(t('common.moneyAdded'))
    },
    onError: (err) => {
      modal.close()
      showError(err)
    },
  })

  const { mutate: withdrawMoney } = useMutation({
    ...postPotsByIdWithdrawMutation(),
    onSuccess: () => {
      invalidate()
      modal.close()
      showSuccess(t('common.moneyWithdrawn'))
    },
    onError: (err) => {
      modal.close()
      showError(err)
    },
  })

  /**
   * Reads form data via the bridge, validates, parses target, and calls create mutation.
   */
  const handleSubmit = useCallback(() => {
    if (formBridge.hasErrors()) {
      formBridge.triggerValidation()
      return
    }
    const values = formBridge.getFormData()
    if (!values) return
    const target = Number(values.target)
    if (!Number.isFinite(target) || target <= 0) return
    if (!values.name.trim()) return
    modal.setSubmitting(true)
    createPot({
      body: {
        name: values.name.trim(),
        target,
        theme: values.theme,
      },
    })
  }, [formBridge, modal, createPot])

  /**
   * Reads form data via the bridge, validates, parses target, and calls update mutation.
   */
  const handleSubmitEdit = useCallback(() => {
    const potId = editingIdRef.current
    if (!potId) return
    if (formBridge.hasErrors()) {
      formBridge.triggerValidation()
      return
    }
    const values = formBridge.getFormData()
    if (!values) return
    const target = Number(values.target)
    if (!Number.isFinite(target) || target <= 0) return
    if (!values.name.trim()) return
    modal.setSubmitting(true)
    updatePot({
      path: { id: potId },
      body: {
        name: values.name.trim(),
        target,
        theme: values.theme,
      },
    })
  }, [formBridge, modal, updatePot])

  /** Opens the Add Pot modal */
  const handleAdd = useCallback(() => {
    const config = createAddPotModalConfig(
      renderForm({ description: t('pots.addModal.description') }),
      handleSubmit,
      {
        title: t('pots.addModal.title'),
        submitLabel: t('pots.addModal.submitLabel'),
      }
    )
    modal.open(config)
  }, [t, modal, handleSubmit, renderForm])

  /**
   * Opens the Edit Pot modal for the given pot.
   * @param pot - The pot to edit
   */
  const handleEdit = useCallback(
    (pot: Pot) => {
      editingIdRef.current = pot.id
      const config = createEditPotModalConfig(
        renderForm({
          initialValues: {
            name: pot.name,
            target: String(pot.target),
            theme: pot.theme,
          },
          description: t('pots.editModal.description'),
        }),
        handleSubmitEdit,
        {
          title: t('pots.editModal.title'),
          submitLabel: t('pots.editModal.submitLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, handleSubmitEdit, renderForm]
  )

  /**
   * Opens the Delete Pot confirmation modal.
   * @param pot - The pot to delete
   */
  const handleDelete = useCallback(
    (pot: Pot) => {
      const config = createDeletePotModalConfig(
        pot.name,
        renderDeleteBody(t('pots.deleteModal.description')),
        () => {
          modal.setSubmitting(true)
          deletePot({ path: { id: pot.id } })
        },
        {
          title: (name: string) => t('pots.deleteModal.title', { name }),
          confirmLabel: t('pots.deleteModal.confirmLabel'),
          cancelLabel: t('pots.deleteModal.cancelLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, deletePot, renderDeleteBody]
  )

  /**
   * Opens the Add Money modal for the given pot.
   * @param pot - The pot to add money to
   */
  const handleAddMoney = useCallback(
    (pot: Pot) => {
      const onSubmit = () => {
        const amount = getAmount()
        if (amount <= 0) return
        modal.setSubmitting(true)
        addMoney({ path: { id: pot.id }, body: { amount } })
      }
      const config = createAddMoneyModalConfig(
        pot.name,
        renderAmountForm(pot, 'add'),
        onSubmit,
        {
          title: (name: string) => t('pots.addMoneyModal.title', { name }),
          submitLabel: t('pots.addMoneyModal.submitLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, addMoney, renderAmountForm, getAmount]
  )

  /**
   * Opens the Withdraw modal for the given pot.
   * @param pot - The pot to withdraw from
   */
  const handleWithdraw = useCallback(
    (pot: Pot) => {
      const onSubmit = () => {
        const amount = getAmount()
        if (amount <= 0) return
        modal.setSubmitting(true)
        withdrawMoney({ path: { id: pot.id }, body: { amount } })
      }
      const config = createWithdrawModalConfig(
        pot.name,
        renderAmountForm(pot, 'withdraw'),
        onSubmit,
        {
          title: (name: string) => t('pots.withdrawModal.title', { name }),
          submitLabel: t('pots.withdrawModal.submitLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, withdrawMoney, renderAmountForm, getAmount]
  )

  return {
    /** Opens the Add Pot modal */
    handleAdd,
    /** Opens the Edit Pot modal for a given pot */
    handleEdit,
    /** Opens the Delete Pot confirmation modal */
    handleDelete,
    /** Opens the Add Money modal for a given pot */
    handleAddMoney,
    /** Opens the Withdraw modal for a given pot */
    handleWithdraw,
  }
}
