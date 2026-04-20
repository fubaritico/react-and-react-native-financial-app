import { atom } from 'jotai'

import type { IUser } from '../auth/types'

/** Client-side cache of the authenticated user (null = not authenticated) */
export const userAtom = atom<IUser | null>(null)

/** Derived atom — true when a user session exists on the client */
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null)
