/** State of a single password rule */
export type PasswordRuleState = 'pristine' | 'valid' | 'invalid'

/** A single password rule display item */
export interface IPasswordRule {
  /** Translated label for the rule */
  label: string
  /** Current validation state */
  state: PasswordRuleState
}

/** Props for the PasswordRulesList component. */
export interface IPasswordRulesListProps {
  /** Array of password rules with their current state */
  rules: readonly IPasswordRule[]
}
