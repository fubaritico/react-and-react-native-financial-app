import { getErrorMessage } from '@financial-app/shared'
import { Typography, tw } from '@financial-app/ui/native'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type {
  IDeleteBodyRenderer,
  IFeedbackModals,
  IModalHandle,
} from './useFeedbackModals'

/**
 * Returns showSuccess and showError callbacks that open styled modals (native).
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
            style={tw`text-center`}
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
            style={tw`text-center`}
          >
            {__DEV__ ? getErrorMessage(err) : t('common.somethingWentWrong')}
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
 * Returns a renderDeleteBody callback for native modals.
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
