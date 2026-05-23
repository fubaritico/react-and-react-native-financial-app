import EnFlag from '@financial-app/shared/assets/en-flag.svg'
import FrFlag from '@financial-app/shared/assets/fr-flag.svg'
import { Dropdown, Icon, Typography, tw } from '@financial-app/ui/native'
import { type FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { IDropdownOption } from '@financial-app/ui/native'

import type { ILanguageDropdownProps } from './LanguageDropdown'
import type { SvgProps } from 'react-native-svg'

/** Map language code to flag component */
const FLAG_MAP: Partial<Record<string, FC<SvgProps>>> = {
  en: EnFlag,
  fr: FrFlag,
}

/**
 * LanguageDropdown — language picker with flag icons in trigger and menu items (native).
 * Label on left, flag on right.
 * @param props - Language dropdown props
 * @returns A dropdown with flag-decorated items
 */
export function LanguageDropdown({
  selectedValue,
  onSelect,
  accessibilityLabel,
  bottomSheetTitle,
}: Readonly<ILanguageDropdownProps>) {
  const { t } = useTranslation()

  /** Language options */
  const options: IDropdownOption[] = useMemo(
    () => [
      { value: 'en', label: t('settings.languageEn') },
      { value: 'fr', label: t('settings.languageFr') },
    ],
    [t]
  )

  /** Custom trigger — label + flag + caret */
  const renderTrigger = useCallback(
    ({ selectedLabel }: { isOpen: boolean; selectedLabel: string }) => {
      const FlagComponent = FLAG_MAP[selectedValue]
      return (
        <View style={tw`flex-row items-center gap-3 flex-1`}>
          <Typography variant="body" style={tw`flex-1`}>
            {selectedLabel}
          </Typography>
          {FlagComponent ? (
            <View style={{ borderRadius: 2, overflow: 'hidden' }}>
              <FlagComponent width={24} height={24} />
            </View>
          ) : null}
          <Icon
            name="caretDown"
            iconSize="xs"
            color={tw.color('foreground') ?? '#201F24'}
          />
        </View>
      )
    },
    [selectedValue]
  )

  /** Custom item — label + flag */
  const renderItem = useCallback(
    (option: IDropdownOption, { isSelected }: { isSelected: boolean }) => {
      const FlagComponent = FLAG_MAP[option.value]
      return (
        <View style={tw`flex-row items-center gap-3 flex-1`}>
          <Typography
            variant={isSelected ? 'body-bold' : 'body'}
            color={isSelected ? 'on-dark' : 'on-dark-muted'}
            style={tw`flex-1`}
          >
            {option.label}
          </Typography>
          {FlagComponent ? (
            <View style={{ borderRadius: 2, overflow: 'hidden' }}>
              <FlagComponent width={24} height={24} />
            </View>
          ) : null}
        </View>
      )
    },
    []
  )

  return (
    <Dropdown
      options={options}
      selectedValue={selectedValue}
      onSelect={onSelect}
      accessibilityLabel={accessibilityLabel}
      bottomSheetTitle={bottomSheetTitle}
      trigger={renderTrigger}
      renderItem={renderItem}
      buttonFullWidth
      buttonClassName="h-12"
    />
  )
}
