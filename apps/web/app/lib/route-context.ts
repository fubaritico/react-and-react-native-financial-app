import { createContext } from 'react-router'

import type { IUser } from '@financial-app/shared/auth/types'

/** Supabase JWT access token extracted by the auth middleware. */
export const accessTokenContext = createContext<string>()

/** Set-Cookie headers from Supabase auth token refresh (must be forwarded in responses). */
export const responseHeadersContext = createContext<Headers>()

/** Authenticated user from server-side getUser() — hydrated into userAtom on the client. */
export const userContext = createContext<IUser>()
