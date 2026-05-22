import { useCurrency } from '@financial-app/shared'
import { ProgressBar, TextInput, Typography } from '@financial-app/ui'
import { useCallback, useImperativeHandle, useState } from 'react'

import {
  DEFAULT_AMOUNT,
  MODAL_BAR_COLOR,
} from './PotAmountFormContent.constants'

import type { IPotAmountFormContentProps } from './PotAmountFormContent'

/**
 * PotAmountFormContent — form body for Add Money / Withdraw modals (web).
 * Shows "New Amount" row, ProgressBar with buffer, and amount TextInput.
 */
export function PotAmountFormContent({
  currentTotal,
  target,
  mode,
  ref,
  newAmountLabel,
  targetOfLabel,
  amountLabel,
  amountPlaceholder,
}: Readonly<IPotAmountFormContentProps>) {
  const { format } = useCurrency()
  const [amount, setAmount] = useState(DEFAULT_AMOUNT)

  /** Maximum amount the user can enter (derived from pot state) */
  const maxAmount =
    mode === 'add' ? Math.max(0, target - currentTotal) : currentTotal

  /** Constrains input to maxAmount */
  const handleChangeAmount = useCallback(
    (text: string) => {
      if (text === '') {
        setAmount('')
        return
      }
      const n = Number(text)
      if (!Number.isFinite(n) || n < 0) return
      if (n > maxAmount) {
        setAmount(String(maxAmount))
        return
      }
      setAmount(text)
    },
    [maxAmount]
  )

  /** Parsed amount from the constrained input */
  const parsedAmount = (() => {
    const n = Number(amount)
    return Number.isFinite(n) && n > 0 ? n : 0
  })()

  useImperativeHandle(
    ref,
    () => ({
      getAmount: () => parsedAmount,
    }),
    [parsedAmount]
  )

  /** New total after add or withdraw */
  const newTotal =
    mode === 'add' ? currentTotal + parsedAmount : currentTotal - parsedAmount

  /** ProgressBar value: for add = currentTotal, for withdraw = newTotal */
  const barValue = mode === 'add' ? currentTotal : newTotal

  /** New percentage relative to target */
  const newPercentage = target > 0 ? (newTotal / target) * 100 : 0

  /** Buffer color based on mode */
  const bufferColor = mode === 'add' ? 'success' : 'destructive'

  /** Typography color for percentage — foreground until user enters a value */
  const percentageColor =
    parsedAmount > 0
      ? mode === 'add'
        ? 'success'
        : 'destructive'
      : 'foreground'

  const metaLeft = (
    <Typography variant="caption" color={percentageColor} as="p">
      {`${newPercentage.toFixed(1)}%`}
    </Typography>
  )

  const metaRight = (
    <Typography variant="caption" color="muted" as="p">
      {`${targetOfLabel} ${format(target)}`}
    </Typography>
  )

  return (
    <div className="flex flex-col gap-4">
      {/* New Amount row */}
      <div className="flex items-center justify-between">
        <Typography variant="caption" color="muted" as="p">
          {newAmountLabel}
        </Typography>
        <Typography variant="heading-lg" as="p">
          {format(newTotal)}
        </Typography>
      </div>

      {/* Progress bar with buffer */}
      <ProgressBar
        value={barValue}
        max={target}
        color={MODAL_BAR_COLOR}
        size="thin"
        buffer={parsedAmount}
        bufferColor={bufferColor}
        metaLeft={metaLeft}
        metaRight={metaRight}
      />

      {/* Amount input */}
      <TextInput
        label={amountLabel}
        value={amount}
        onChangeText={handleChangeAmount}
        prefix="$"
        placeholder={amountPlaceholder}
        keyboardType="numeric"
        accessibilityLabel={amountLabel}
      />
    </div>
  )
}
