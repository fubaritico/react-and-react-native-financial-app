import { TEST_USER_ID } from '../helpers.js'

export const mockUserPreferences = {
  user_id: TEST_USER_ID,
  mode: null as string | null,
  has_seen_onboarding: false,
  initial_balance_set: false,
  created_at: '2026-05-17T10:00:00.000Z',
  updated_at: '2026-05-17T10:00:00.000Z',
}

export const mockUserPreferencesManual = {
  ...mockUserPreferences,
  mode: 'manual' as const,
  has_seen_onboarding: true,
  updated_at: '2026-05-17T11:00:00.000Z',
}
