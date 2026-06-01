import { afterEach, describe, expect, it } from 'vitest'

import { getLastContentRoute, trackContentRoute } from './last-content-route'

// Module-level state — reset to the default after each test.
afterEach(() => {
  trackContentRoute('/')
})

describe('last-content-route', () => {
  describe('happy path', () => {
    it('defaults to the overview route', () => {
      expect(getLastContentRoute()).toBe('/')
    })

    it('records a content route as the last route', () => {
      trackContentRoute('/transactions')
      expect(getLastContentRoute()).toBe('/transactions')
    })
  })

  describe('variants', () => {
    it.each(['/', '/transactions', '/budgets', '/pots', '/recurring'])(
      'tracks the content route %s',
      (route) => {
        trackContentRoute(route)
        expect(getLastContentRoute()).toBe(route)
      }
    )

    it('ignores settings sub-screens, keeping the previous content route', () => {
      trackContentRoute('/budgets')
      trackContentRoute('/settings')
      trackContentRoute('/settings/categories')
      expect(getLastContentRoute()).toBe('/budgets')
    })
  })

  // L3 managed errors: N/A — pure synchronous getter/setter with no error handling
  // L4 unmanaged errors: N/A — no async operations or external dependencies

  describe('edge cases', () => {
    it('reproduces the Settings → Categories → back regression', () => {
      // Home → Transactions → Settings → Categories → back to Settings
      trackContentRoute('/')
      trackContentRoute('/transactions')
      trackContentRoute('/settings')
      trackContentRoute('/settings/categories')
      trackContentRoute('/settings') // "je reviens" from Categories
      // Cancelling on Settings must return to Transactions, not Categories
      expect(getLastContentRoute()).toBe('/transactions')
    })

    it('never returns a settings route when only settings screens were visited', () => {
      trackContentRoute('/settings')
      trackContentRoute('/settings/categories')
      expect(getLastContentRoute()).toBe('/')
    })
  })
})
