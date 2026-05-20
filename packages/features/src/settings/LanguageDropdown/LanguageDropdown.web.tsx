import EnFlag from '@financial-app/shared/assets/en-flag.svg?react'
import FrFlag from '@financial-app/shared/assets/fr-flag.svg?react'
import { Dropdown, Icon, Typography } from '@financial-app/ui'
import { type FC, type SVGProps, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { IDropdownOption } from '@financial-app/ui'

import type { ILanguageDropdownProps } from './LanguageDropdown'

/** Map language code to flag component */
const FLAG_MAP: Partial<Record<string, FC<SVGProps<SVGSVGElement>>>> = {
  en: EnFlag,
  fr: FrFlag,
}

/**
 * LanguageDropdown — language picker with flag icons in trigger and menu items (web).
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
        <span className="inline-flex flex-1 items-center gap-3">
          <Typography variant="body" as="span" className="flex-1 text-left">
            {selectedLabel}
          </Typography>
          {FlagComponent ? (
            <FlagComponent
              width={24}
              height={24}
              aria-hidden="true"
              className="rounded-sm"
            />
          ) : null}
          <Icon name="caretDown" iconSize="xs" color="currentColor" />
        </span>
      )
    },
    [selectedValue]
  )

  /** Custom item — label + flag */
  const renderItem = useCallback(
    (option: IDropdownOption, { isSelected }: { isSelected: boolean }) => {
      const FlagComponent = FLAG_MAP[option.value]
      return (
        <span className="inline-flex w-full items-center gap-3">
          <Typography
            variant={isSelected ? 'body-bold' : 'body'}
            as="span"
            className="flex-1 text-inherit"
          >
            {option.label}
          </Typography>
          {FlagComponent ? (
            <FlagComponent
              width={24}
              height={24}
              aria-hidden="true"
              className="rounded-sm"
            />
          ) : null}
        </span>
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
    />
  )
}
