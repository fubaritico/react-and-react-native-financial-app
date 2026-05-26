import {
  Button,
  Card,
  CategoryButton,
  Icon,
  IconButton,
  TextInput,
  Typography,
  cn,
} from '@financial-app/ui'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { IconName } from '@financial-app/icons'

import { ThemeColorDropdown } from '../../pots/ThemeColorDropdown/ThemeColorDropdown.web'

import {
  CATEGORY_ICON_NAMES,
  MAX_CATEGORY_NAME_LENGTH,
  PALETTE_COLORS,
} from './CategoriesScreenView.constants'
import { web } from './CategoriesScreenView.styles'

import type { ICategoriesScreenViewProps } from './CategoriesScreenView'

/** Props for the internal IconCell component. */
interface IIconCellProps {
  /** Icon name to display. */
  iconName: IconName
  /** Whether this icon is currently selected. */
  isSelected: boolean
  /** Callback when the icon is clicked. */
  onSelect: (name: IconName) => void
}

/**
 * Memoized icon cell for the icon selector grid — avoids inline arrow in map.
 * @param props - Icon cell props
 * @returns A clickable icon cell button
 */
const IconCell = memo(function IconCell({
  iconName,
  isSelected,
  onSelect,
}: Readonly<IIconCellProps>) {
  /** Fires onSelect with this icon name. */
  const handleClick = useCallback(() => {
    onSelect(iconName)
  }, [iconName, onSelect])

  return (
    <button
      type="button"
      className={cn(
        web.iconCell,
        isSelected ? web.iconCellSelected : web.iconCellDefault
      )}
      onClick={handleClick}
      aria-label={iconName}
      aria-pressed={isSelected}
    >
      <Icon name={iconName} iconSize="lg" color="currentColor" />
    </button>
  )
})

/**
 * Web implementation of the categories management screen.
 * Displays a grid of existing categories with inline add form.
 * @param props - Screen props with categories data and callbacks
 * @returns The categories management screen
 */
export function CategoriesScreenView({
  categories,
  onAddCategory,
  onDeleteCategory,
  isAdding,
  deletingId,
  onGoBack,
}: Readonly<ICategoriesScreenViewProps>) {
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null)
  const [selectedColor, setSelectedColor] = useState('')

  /**
   * Resets the form fields to their initial state.
   * @returns void
   */
  const resetForm = useCallback(() => {
    setName('')
    setSelectedIcon(null)
    setSelectedColor('')
  }, [])

  /**
   * Submits the new category form and resets fields.
   * @returns void
   */
  const handleSubmit = useCallback(() => {
    const trimmed = name.trim()
    if (!trimmed || !selectedIcon || !selectedColor) return
    onAddCategory({ name: trimmed, icon: selectedIcon, color: selectedColor })
    resetForm()
  }, [name, selectedIcon, selectedColor, onAddCategory, resetForm])

  /**
   * Handles delete button click for a category.
   * @param id - Category ID to delete
   * @returns void
   */
  const handleDelete = useCallback(
    (id: string) => {
      onDeleteCategory(id)
    },
    [onDeleteCategory]
  )

  return (
    <div className={web.root}>
      <div className={web.container}>
        {/* Header */}
        <div className={web.header}>
          <IconButton
            variant="secondary"
            icon="arrowLeft"
            onPress={onGoBack}
            accessibilityLabel={t('common.back')}
            shadow
          />
          <Typography variant="heading-lg" as="h1">
            {t('categories.title')}
          </Typography>
        </div>

        {/* Category grid */}
        <Card shadow>
          <div className={web.grid}>
            {categories.map((cat) => (
              <CategoryButton
                key={cat.id}
                id={cat.id}
                icon={cat.icon}
                color={cat.color}
                name={cat.name}
                accessibilityLabel={cat.name}
                isDeletable={!cat.is_system}
                onDelete={handleDelete}
                isDeleting={deletingId === cat.id}
              />
            ))}
          </div>
        </Card>

        {/* Add category form */}
        <div className={web.formWrapper}>
          <Typography variant="heading-lg" as="h2">
            {t('categories.addCategory')}
          </Typography>

          {/* Name input */}
          <div className={web.formRow}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('categories.namePlaceholder')}
              maxLength={MAX_CATEGORY_NAME_LENGTH}
            />
          </div>

          {/* Color selector */}
          <div className={web.formRow}>
            <ThemeColorDropdown
              options={PALETTE_COLORS}
              selectedValue={selectedColor}
              onSelect={setSelectedColor}
              accessibilityLabel={t('categories.color')}
              bottomSheetTitle={t('categories.color')}
              alreadyUsedLabel=""
              placeholder={t('categories.selectColor')}
              buttonClassName="bg-white"
            />
          </div>

          {/* Icon selector */}
          <div className={web.formRow}>
            <Card shadow>
              <div className={web.iconGrid}>
                {CATEGORY_ICON_NAMES.map((iconName) => (
                  <IconCell
                    key={iconName}
                    iconName={iconName}
                    isSelected={iconName === selectedIcon}
                    onSelect={setSelectedIcon}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Submit */}
          <div className={web.submitWrapper}>
            <Button
              title={isAdding ? t('categories.adding') : t('categories.add')}
              onPress={handleSubmit}
              variant="primary"
              loading={isAdding}
              disabled={!name.trim() || !selectedIcon || !selectedColor}
              centered
            />
          </div>
        </div>
      </div>
    </div>
  )
}
