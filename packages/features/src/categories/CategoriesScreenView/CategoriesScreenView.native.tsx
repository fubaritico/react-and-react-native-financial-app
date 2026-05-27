import {
  Button,
  Card,
  CategoryButton,
  Icon,
  IconButton,
  TextInput,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native'

import type { IconName } from '@financial-app/icons'

import { ThemeColorDropdown } from '../../pots/ThemeColorDropdown/ThemeColorDropdown.native'

import {
  CATEGORY_ICON_NAMES,
  MAX_CATEGORY_NAME_LENGTH,
  PALETTE_COLORS,
} from './CategoriesScreenView.constants'
import {
  GRID_COLUMNS,
  GRID_GAP,
  ICON_GRID_COLUMNS,
  ICON_GRID_GAP,
  native,
} from './CategoriesScreenView.styles'

import type { ICategoriesScreenViewProps } from './CategoriesScreenView'

/** Props for the internal IconCell component. */
interface IIconCellProps {
  /** Icon name to display. */
  iconName: IconName
  /** Whether this icon is currently selected. */
  isSelected: boolean
  /** Cell size in pixels. */
  size: number
  /** Callback when the icon is pressed. */
  onSelect: (name: IconName) => void
}

/**
 * Memoized icon cell for the icon selector grid — avoids inline arrow in map.
 * @param props - Icon cell props
 * @returns A pressable icon cell
 */
const IconCell = memo(function IconCell({
  iconName,
  isSelected,
  size,
  onSelect,
}: Readonly<IIconCellProps>) {
  /** Fires onSelect with this icon name. */
  const handlePress = useCallback(() => {
    onSelect(iconName)
  }, [iconName, onSelect])

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={iconName}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      style={[
        tw`${native.iconCell} ${isSelected ? native.iconCellSelected : native.iconCellDefault}`,
        { width: size, height: size, minWidth: 44, minHeight: 44 },
      ]}
    >
      <Icon
        name={iconName}
        iconSize="lg"
        color={isSelected ? 'on-dark' : 'grey-500'}
      />
    </Pressable>
  )
})

/**
 * Native implementation of the categories management screen.
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
  const { width: screenWidth } = useWindowDimensions()

  /** Card inner padding (p-4 = 16px per side) + screen padding (px-5 = 20px per side). */
  const CARD_PADDING = 16
  const SCREEN_PADDING = 20

  /** Width available inside the Card for the category grid. */
  const gridInnerWidth = screenWidth - SCREEN_PADDING * 2 - CARD_PADDING * 2

  /** Width of one category cell — 4 columns with gaps. */
  const cellWidth = useMemo(
    () => (gridInnerWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS,
    [gridInnerWidth]
  )

  /** Width of one icon cell — 6 columns with gaps, inside Card padding. */
  const iconCellSize = useMemo(
    () =>
      (gridInnerWidth - ICON_GRID_GAP * (ICON_GRID_COLUMNS - 1)) /
      ICON_GRID_COLUMNS,
    [gridInnerWidth]
  )

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
   * Handles delete for a category by ID.
   * @param id - Category ID
   * @returns void
   */
  const handleDelete = useCallback(
    (id: string) => {
      onDeleteCategory(id)
    },
    [onDeleteCategory]
  )

  return (
    <ScrollView contentContainerStyle={tw`${native.scrollContent}`}>
      {/* Header */}
      <View style={tw`${native.header}`}>
        <IconButton
          variant="secondary"
          icon="arrowLeft"
          onPress={onGoBack}
          accessibilityLabel={t('common.back')}
          shadow
        />
        <Typography variant="heading-lg" accessibilityRole="header">
          {t('categories.title')}
        </Typography>
      </View>

      {/* Category grid */}
      <Card shadow>
        <View style={[tw`${native.grid}`, { gap: GRID_GAP }]}>
          {categories.map((cat) => (
            <View key={cat.id} style={{ width: cellWidth }}>
              <CategoryButton
                id={cat.id}
                icon={cat.icon}
                color={cat.color}
                name={cat.name}
                accessibilityLabel={cat.name}
                isDeletable={!cat.is_system}
                onDelete={handleDelete}
                isDeleting={deletingId === cat.id}
              />
            </View>
          ))}
        </View>
      </Card>

      {/* Add category form */}
      <View style={tw`${native.formWrapper}`}>
        <Typography variant="heading-lg" accessibilityRole="header">
          {t('categories.addCategory')}
        </Typography>

        <Card shadow>
          <View style={tw`${native.formWrapper}`}>
            {/* Name input */}
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('categories.namePlaceholder')}
              maxLength={MAX_CATEGORY_NAME_LENGTH}
            />
            {/* Color selector */}
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
            {/* Icon selector */}
            <View style={[tw`${native.iconGrid}`, { gap: ICON_GRID_GAP }]}>
              {CATEGORY_ICON_NAMES.map((iconName) => (
                <IconCell
                  key={iconName}
                  iconName={iconName}
                  isSelected={iconName === selectedIcon}
                  size={iconCellSize}
                  onSelect={setSelectedIcon}
                />
              ))}
            </View>
          </View>
        </Card>

        {/* Submit */}
        <Button
          title={isAdding ? t('categories.adding') : t('categories.add')}
          onPress={handleSubmit}
          variant="primary"
          loading={isAdding}
          disabled={!name.trim() || !selectedIcon || !selectedColor}
          fullWidth
          centered
        />
      </View>
    </ScrollView>
  )
}
