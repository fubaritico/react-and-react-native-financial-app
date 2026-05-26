import { CategoriesScreenView } from '@financial-app/features'
import {
  deleteCategoriesByIdMutation,
  getCategoriesOptions,
  getCategoriesQueryKey,
  postCategoriesMutation,
} from '@financial-app/http-client'
import { useModal } from '@financial-app/shared'
import { Typography } from '@financial-app/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import type { INewCategoryData } from '@financial-app/features'
import type { CreateCategory } from '@financial-app/http-client'
import type { ICategory } from '@financial-app/shared'

/**
 * Web route for category management — list, create, delete custom categories.
 * @returns The categories screen wired to API mutations
 */
export default function CategoriesScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const modal = useModal()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: categories = [] } = useQuery(getCategoriesOptions())

  const createCategory = useMutation({
    ...postCategoriesMutation(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getCategoriesQueryKey(),
      })
    },
  })

  const deleteCategory = useMutation({
    ...deleteCategoriesByIdMutation(),
    onSuccess: () => {
      setDeletingId(null)
      void queryClient.invalidateQueries({
        queryKey: getCategoriesQueryKey(),
      })
      modal.close()
    },
    onError: () => {
      setDeletingId(null)
      modal.open({
        title: t('categories.deleteConfirmTitle'),
        body: (
          <Typography variant="body" align="center">
            {t('categories.inUseError')}
          </Typography>
        ),
        dismissable: false,
        actions: [
          {
            label: 'OK',
            variant: 'primary',
            onPress: () => {
              modal.close()
            },
          },
        ],
      })
    },
  })

  /**
   * Creates a new custom category.
   * @param data - New category data (name, icon, color)
   */
  const handleAddCategory = useCallback(
    (data: INewCategoryData) => {
      createCategory.mutate({
        body: data as CreateCategory,
      })
    },
    [createCategory]
  )

  /**
   * Confirms and deletes a custom category.
   * @param id - Category ID to delete
   */
  const handleDeleteCategory = useCallback(
    (id: string) => {
      const cat = categories.find((c) => c.id === id)
      if (!cat) return

      modal.open({
        title: t('categories.deleteConfirmTitle'),
        body: (
          <Typography variant="body" align="center">
            {t('categories.deleteConfirmMessage', { name: cat.name })}
          </Typography>
        ),
        actions: [
          {
            label: t('categories.deleteConfirm'),
            variant: 'destroy',
            onPress: () => {
              setDeletingId(id)
              deleteCategory.mutate({ path: { id } })
            },
          },
        ],
        cancelLabel: t('categories.deleteCancel'),
      })
    },
    [categories, modal, t, deleteCategory]
  )

  /** Navigates back to settings */
  const handleGoBack = useCallback(() => {
    void navigate('/settings')
  }, [navigate])

  return (
    <CategoriesScreenView
      categories={categories as ICategory[]}
      onAddCategory={handleAddCategory}
      onDeleteCategory={handleDeleteCategory}
      isAdding={createCategory.isPending}
      deletingId={deletingId}
      onGoBack={handleGoBack}
    />
  )
}
