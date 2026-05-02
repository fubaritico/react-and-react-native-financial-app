import { createContext, useContext } from 'react'

import type { ListboxVariant } from '../Listbox/Listbox'

/** Shared state for BottomSheet compound sub-components */
export interface IBottomSheetContextValue {
  /** Color scheme */
  variant: ListboxVariant
  /** Close the bottom sheet */
  onClose: () => void
}

export const BottomSheetContext =
  createContext<IBottomSheetContextValue | null>(null)

/**
 * Accesses the BottomSheet compound context.
 * @throws If used outside a `<BottomSheet>` provider.
 */
export const useBottomSheetContext = () => {
  const context = useContext(BottomSheetContext)
  if (!context)
    throw new Error('BottomSheet subcomponents must be used within BottomSheet')
  return context
}
