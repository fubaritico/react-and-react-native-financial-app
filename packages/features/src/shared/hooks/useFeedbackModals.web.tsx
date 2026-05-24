import { getErrorMessage } from '@financial-app/shared'
import { Typography } from '@financial-app/ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type {
  IDeleteBodyRenderer,
  IFeedbackModals,
  IModalHandle,
} from './useFeedbackModals'

/**
 * Returns showSuccess and showError callbacks that open styled modals (web).
 * @param modal - Modal handle from useModal()
 * @returns Feedback modal callbacks
 */
export function useFeedbackModals(modal: IModalHandle): IFeedbackModals {
  const { t } = useTranslation()

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

  return { showSuccess, showError }
}

/**
 * Returns a renderDeleteBody callback for web modals.
 * @returns Delete body renderer
 */
export function useDeleteBodyRenderer(): IDeleteBodyRenderer {
  const renderDeleteBody = useCallback(
    (description: string) => (
      <Typography variant="body" color="muted">
        {description}
      </Typography>
    ),
    []
  )

  return { renderDeleteBody }
}
