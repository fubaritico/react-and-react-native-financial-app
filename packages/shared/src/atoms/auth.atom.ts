import { atom } from 'jotai'

import type { IUser } from '../auth/types'

export const userAtom = atom<IUser | null>(null)
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null)
