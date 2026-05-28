import { createContext } from 'react-router'

/** Supabase JWT access token extracted by the auth middleware. */
export const accessTokenContext = createContext<string>()

/** Set-Cookie headers from Supabase auth token refresh (must be forwarded in responses). */
export const responseHeadersContext = createContext<Headers>()
