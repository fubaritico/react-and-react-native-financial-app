import { Dropdown, Icon, Typography, tw } from '@financial-app/ui/native'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { SupportedCurrency } from '@financial-app/shared'
import type { IDropdownOption } from '@financial-app/ui/native'

import { CURRENCY_SYMBOL_MAP } from './CurrencyDropdown.constants'

import type { ICurrencyDropdownProps } from './CurrencyDropdown'

/**
 * CurrencyDropdown — currency picker with symbol in trigger and menu items (native).
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
        <View style={tw`flex-row items-center gap-3 flex-1`}>
          <Typography variant="body" style={tw`flex-1`}>
            {selectedLabel}
          </Typography>
          <Typography variant="body-bold">{symbol}</Typography>
          <Icon name="caretDown" iconSize="xs" color="foreground" />
        </View>
      )
    },
    [selectedValue]
  )

  /** Custom item — label + symbol */
  const renderItem = useCallback(
    (option: IDropdownOption, { isSelected }: { isSelected: boolean }) => {
      const symbol = CURRENCY_SYMBOL_MAP[option.value as SupportedCurrency]
      return (
        <View style={tw`flex-row items-center gap-3 flex-1`}>
          <Typography
            variant={isSelected ? 'body-bold' : 'body'}
            color={isSelected ? 'on-dark' : 'on-dark-muted'}
            style={tw`flex-1`}
          >
            {option.label}
          </Typography>
          <Typography
            variant={isSelected ? 'body-bold' : 'body'}
            color={isSelected ? 'on-dark' : 'on-dark-muted'}
          >
            {symbol}
          </Typography>
        </View>
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
