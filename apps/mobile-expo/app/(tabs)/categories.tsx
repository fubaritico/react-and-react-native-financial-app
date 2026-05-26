import { CategoriesScreenView } from '@financial-app/features'
import {
  deleteCategoriesByIdMutation,
  getCategoriesOptions,
  getCategoriesQueryKey,
  postCategoriesMutation,
} from '@financial-app/http-client'
import { useModal } from '@financial-app/shared'
import { Typography } from '@financial-app/ui/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { INewCategoryData } from '@financial-app/features'
import type { CreateCategory } from '@financial-app/http-client'
import type { ICategory } from '@financial-app/shared'

/**
 * Mobile route for category management — list, create, delete custom categories.
 * @returns The categories screen wired to API mutations
 */
export default function CategoriesScreen() {
  const { t } = useTranslation()
  const router = useRouter()
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
        actions: [],
        cancelLabel: t('categories.deleteCancel'),
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
    router.back()
  }, [router])

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
