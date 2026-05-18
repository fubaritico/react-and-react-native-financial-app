import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  // Public routes (no sidebar)
  route('login', 'routes/login.tsx'),
  route('signup', 'routes/signup.tsx'),
  route('verify-email', 'routes/verify-email.tsx'),
  route('account-activated', 'routes/account-activated.tsx'),
  route('totp-enroll', 'routes/totp-enroll.tsx'),
  route('totp-challenge', 'routes/totp-challenge.tsx'),
  route('mode-choice', 'routes/mode-choice.tsx'),

  // Protected routes (sidebar layout)
  layout('routes/layout.tsx', [
    index('routes/home.tsx'),
    route('transactions', 'routes/transactions.tsx'),
    route('budgets', 'routes/budgets.tsx'),
    route('pots', 'routes/pots.tsx'),
    route('recurring', 'routes/recurring.tsx'),
  ]),
] satisfies RouteConfig
