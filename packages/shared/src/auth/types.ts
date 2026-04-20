export interface IAuthStorage {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}

export interface ISignInPayload {
  email: string
  password: string
}

export interface ISignUpPayload {
  name: string
  email: string
  password: string
}

export type OAuthProvider = 'google'
