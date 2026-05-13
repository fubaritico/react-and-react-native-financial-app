import { atom } from 'jotai'

import type { IUser } from '../auth/types'

/** Client-side cache of the authenticated user (null = not authenticated) */
export const userAtom = atom<IUser | null>(null)

/** Derived atom — true when a user session exists on the client */
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null)

/** True until the first auth state change fires — prevents redirect flicker on cold start */
export const isAuthLoadingAtom = atom(true)

/** True once useConfigureHttpClient has set the auth callback — prevents queries firing without token */
export const isHttpClientReadyAtom = atom(false)
