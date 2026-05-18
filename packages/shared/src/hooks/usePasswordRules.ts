import { useMemo, useRef } from 'react'

/** State of a single password rule */
export type PasswordRuleState = 'pristine' | 'valid' | 'invalid'

/** A single password rule with its current validation state */
export interface IPasswordRuleResult {
  /** Rule identifier key (maps to i18n) */
  key: string
  /** Current validation state */
  state: PasswordRuleState
}

const PASSWORD_RULES = [
  { key: 'minLength', pattern: /.{16,}/ },
  { key: 'uppercase', pattern: /[A-Z]/ },
  { key: 'lowercase', pattern: /[a-z]/ },
  { key: 'digit', pattern: /[0-9]/ },
  { key: 'special', pattern: /[$@&+?!\-/]/ },
] as const

/**
 * Resolves a rule state based on current pass/fail and history.
 * - pristine: never matched
 * - valid: currently matches
 * - invalid: matched before but no longer
 */
function resolveState(passes: boolean, wasValid: boolean): PasswordRuleState {
  if (passes) return 'valid'
  if (wasValid) return 'invalid'
  return 'pristine'
}

/**
 * Tracks password strength rules with three-state logic:
 * pristine (never matched), valid (currently matches), invalid (matched before but no longer).
 *
 * @param password - Current password value
 * @param confirmPassword - Current confirm password value
 * @returns Array of rule results with state per rule, plus an `allValid` flag
 */
export function usePasswordRules(
  password: string,
  confirmPassword: string
): { rules: IPasswordRuleResult[]; allValid: boolean } {
  const wasValidRef = useRef<Record<string, boolean>>({})

  const rules = useMemo(() => {
    const results: IPasswordRuleResult[] = PASSWORD_RULES.map(
      ({ key, pattern }) => {
        const passes = pattern.test(password)

        if (passes) {
          wasValidRef.current[key] = true
        }

        return {
          key,
          state: resolveState(passes, wasValidRef.current[key]),
        }
      }
    )

    // Password match rule
    const matchKey = 'match'
    const matchPasses =
      password.length > 0 &&
      confirmPassword.length > 0 &&
      password === confirmPassword

    if (matchPasses) {
      wasValidRef.current[matchKey] = true
    }

    results.push({
      key: matchKey,
      state: resolveState(matchPasses, wasValidRef.current[matchKey]),
    })

    return results
  }, [password, confirmPassword])

  const allValid = rules.every((r) => r.state === 'valid')

  return { rules, allValid }
}
