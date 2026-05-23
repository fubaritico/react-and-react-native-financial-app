import { Dropdown, Icon, Typography } from '@financial-app/ui'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { SupportedCurrency } from '@financial-app/shared'
import type { IDropdownOption } from '@financial-app/ui'

import { CURRENCY_SYMBOL_MAP } from './CurrencyDropdown.constants'

import type { ICurrencyDropdownProps } from './CurrencyDropdown'

/**
 * CurrencyDropdown — currency picker with symbol in trigger and menu items (web).
 * Label on left, symbol on right.
 * @param props - Currency dropdown props
 * @returns A dropdown with currency symbol-decorated items
 */
export function CurrencyDropdown({
  selectedValue,
  onSelect,
  accessibilityLabel,
  bottomSheetTitle,
}: Readonly<ICurrencyDropdownProps>) {
  const { t } = useTranslation()

  /** Currency options */
  const options: IDropdownOption[] = useMemo(
    () => [
      { value: 'USD', label: t('settings.currencyUsd') },
      { value: 'EUR', label: t('settings.currencyEur') },
      { value: 'GBP', label: t('settings.currencyGbp') },
    ],
    [t]
  )

  /** Wraps onSelect to cast string back to SupportedCurrency */
  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value as SupportedCurrency)
    },
    [onSelect]
  )

  /** Custom trigger — label + symbol + caret */
  const renderTrigger = useCallback(
    ({ selectedLabel }: { isOpen: boolean; selectedLabel: string }) => {
      const symbol = CURRENCY_SYMBOL_MAP[selectedValue]
      return (
        <span className="inline-flex flex-1 items-center gap-3">
          <Typography variant="body" as="span" className="flex-1 text-left">
            {selectedLabel}
          </Typography>
          <Typography variant="body-bold" as="span">
            {symbol}
          </Typography>
          <Icon name="caretDown" iconSize="xs" color="currentColor" />
        </span>
      )
    },
    [selectedValue]
  )

  /** Custom item — label + symbol */
  const renderItem = useCallback(
    (option: IDropdownOption, { isSelected }: { isSelected: boolean }) => {
      const symbol = CURRENCY_SYMBOL_MAP[option.value as SupportedCurrency]
      return (
        <span className="inline-flex w-full items-center gap-3">
          <Typography
            variant={isSelected ? 'body-bold' : 'body'}
            as="span"
            className="flex-1 text-inherit"
          >
            {option.label}
          </Typography>
          <Typography
            variant={isSelected ? 'body-bold' : 'body'}
            as="span"
            className="text-inherit"
          >
            {symbol}
          </Typography>
        </span>
      )
    },
    []
  )

  return (
    <Dropdown
      options={options}
      selectedValue={selectedValue}
      onSelect={handleSelect}
      accessibilityLabel={accessibilityLabel}
      bottomSheetTitle={bottomSheetTitle}
      trigger={renderTrigger}
      renderItem={renderItem}
      buttonFullWidth
      buttonClassName="h-12"
    />
  )
}
