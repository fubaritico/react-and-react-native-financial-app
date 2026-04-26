import { createContext, useContext } from 'react'

import type { ListboxVariant } from '../Listbox/Listbox'

/** Shared state for Drawer compound sub-components */
export interface IDrawerContextValue {
  /** Color scheme */
  variant: ListboxVariant
  /** Close the drawer */
  onClose: () => void
}

export const DrawerContext = createContext<IDrawerContextValue | null>(null)

/**
 * Accesses the Drawer compound context.
 * @throws If used outside a `<Drawer>` provider.
 */
export const useDrawerContext = () => {
  const context = useContext(DrawerContext)
  if (!context)
    throw new Error('Drawer subcomponents must be used within Drawer')
  return context
}
