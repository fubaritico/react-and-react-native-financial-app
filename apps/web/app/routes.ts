import {
  index,
  layout,
  route,
  type RouteConfig,
} from '@react-router/dev/routes'

export default [
  // Public routes (no sidebar)
  route('login', 'routes/login.tsx'),
  route('signup', 'routes/signup.tsx'),

  // Protected routes (sidebar layout)
  layout('routes/layout.tsx', [
    index('routes/home.tsx'),
    route('transactions', 'routes/transactions.tsx'),
    route('budgets', 'routes/budgets.tsx'),
    route('pots', 'routes/pots.tsx'),
    route('recurring', 'routes/recurring.tsx'),
  ]),
] satisfies RouteConfig
