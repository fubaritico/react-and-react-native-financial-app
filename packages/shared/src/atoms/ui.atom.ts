import { atom } from 'jotai'

/** Global loading state for async operations (auth, navigation transitions) */
export const isLoadingAtom = atom(false)
