# Application Specifications

> Single source of truth for product requirements.
> For UI/component analysis, see `files/docs and context/PERSONAL_FINANCE_ANALYSIS_EN.md`.
> For database schema, see `supabase/setup.sql`.

---

## 1. Product Vision

A **cross-platform personal finance app** (React Native and React web) that lets users manage
their budget either **from scratch** (manual entry) or by **importing real bank transactions**
via open banking. The app is a **forecasting tool**, not a ledger — users define budgets,
saving goals, and track recurring bills to expect their financial situation.

---

## 2. Core Specifications (Frontend Mentor)

Based on the [Frontend Mentor Personal Finance challenge](files/proto/personal-finance-app/README.md):

- See all personal finance data at a glance on the Overview page
- View all transactions with pagination (10 per page), search, sort, and filter by category
- CRUD budgets and savings pots
- View the latest three transactions per budget category
- View progress towards each pot
- Add money to / withdraw money from pots
- View recurring bills and their status (paid, upcoming, due soon) for the current month
- Search and sort recurring bills
- Form validation messages for required fields
- Full keyboard navigation (web)
- Responsive layout (mobile, tablet, desktop)
- Hover and focus states for all interactive elements (web)

---

## 3. Extended Specifications

### 3.1 Authentication

- A user must log in to access the application
- A connected user is redirected to the Overview page
- Sign up with email/password (Supabase Auth)
- Sign in with email/password
- Sign out (clears session on current device)
- Session persistence (AsyncStorage on native, localStorage on web)
- Password recovery via email (nice-to-have)
- OAuth Google/Apple (nice-to-have — Google client IDs not yet configured)

**Cross-device sessions**: each device holds its own Supabase session. Signing out on web
does NOT sign out mobile. For finance-grade security, session validation on app focus
(AppState change -> `getSession()`) will be implemented to detect revoked sessions.

### 3.2 Data Modes

The app operates on a **monthly cycle**. Each month, the user works with a fresh set of
transaction data — either imported from their bank or built manually.

| Mode | Transaction source | Monthly cycle |
|------|--------------------|---------------|
| **Bank** | Imported from GoCardless at the start of each month | Re-import real transactions monthly. Budgets, pots, and recurring definitions persist across months. |
| **Manual** | User defines transactions by hand | User creates transactions + defines recurring items (income AND expenses) that auto-generate each new month. |

The user picks a mode during onboarding. They can switch to bank mode later (settings screen).
Both modes can coexist — a user in bank mode can still add manual transactions on top of
imported ones. The `source` field (`manual` | `bank`) on each transaction distinguishes them.

#### Manual mode — recurring definitions

In manual mode, the user can define **recurring transactions** (both income and expenses):
- Salary, freelance income, rental income (positive amounts)
- Rent, subscriptions, loan payments, utilities (negative amounts)

These recurring definitions auto-generate transactions at the start of each month,
giving the user a pre-filled forecast to work from. The user can then adjust, add
one-off transactions, and track against their budgets.

#### Bank mode — monthly re-import

At the start of each month (or on manual trigger), the app re-imports transactions
from GoCardless for the new period. Previous months' data stays in the database —
it's historical. Budgets, pots, and recurring bill identifications carry over automatically.

### 3.3 Onboarding (New User)

This flow is **not covered by the Figma/Frontend Mentor designs** — screens must be designed
from scratch. It triggers right after a successful sign-up (first-time login).

#### Flow

```
Sign Up success
    |
    v
Onboarding screen: "How do you want to get started?"
    |
    +--- "Start from scratch"
    |        |
    |        v
    |    Set reference balance (optional — default 0)
    |        |
    |        v
    |    -> Overview (empty state)
    |
    +--- "Connect my bank account"
             |
             v
         Bank selection (GoCardless institution list)
             |
             v
         Bank OAuth (in-app browser)
             |
             v
         Import transactions (loading screen with progress)
             |
             v
         -> Overview (with imported transactions)
```

There is no "Import demo data" option in the real app — demo seeding is developer-only
(via `POST /dev/seed` endpoint, disabled in production).

#### Screens to create (not in Figma)

| Screen | Purpose |
|--------|---------|
| **Onboarding Choice** | Two cards: "Start from scratch" / "Connect my bank" |
| **Set Initial Balance** | Optional step for "from scratch" — single amount input, skip button |
| **Bank Selection** | List of French banks from GoCardless API, search filter |
| **Bank Auth Redirect** | Loading/waiting screen while user authenticates with their bank |
| **Import Progress** | Progress indicator while transactions are fetched and inserted |
| **Onboarding Complete** | Brief success confirmation, CTA to go to Overview |

### 3.4 Empty States (Initial Screen States)

When a user starts from scratch, every screen is empty. When a user connects their bank,
some screens have data (transactions) but others remain empty. Each screen and each Overview
section must handle its empty state gracefully.

#### Per-screen empty states

| Screen | From scratch | Bank connected |
|--------|-------------|----------------|
| **Overview — Balance** | 0 / 0 / 0 (or user-set reference) | Computed from imported transactions |
| **Overview — Pots** | "No savings goals yet" + CTA "Create your first pot" | Same — pots are always manual |
| **Overview — Transactions** | "No transactions yet" + CTA "Add a transaction" | Shows latest 5 imported transactions |
| **Overview — Budgets** | "No budgets yet" + CTA "Create your first budget" | Same — budgets are always manual |
| **Overview — Recurring** | "No recurring items yet" + CTA "Define recurring income or expenses" | Shows detected recurring from imported transactions |
| **Transactions** | Empty list + CTA "Add your first transaction" | Imported transaction list (paginated) |
| **Budgets** | Empty state + CTA "Add New Budget" | Same — no budgets until user creates them |
| **Pots** | Empty state + CTA "Add New Pot" | Same — no pots until user creates them |
| **Recurring** | Empty state + CTA "Define your first recurring transaction" | Shows auto-detected recurring from bank + user can add manual ones |

#### Empty state design rules

- Every empty state must include:
  1. An **illustration or icon** (subtle, not heavy)
  2. A **short message** explaining what belongs here
  3. A **primary CTA button** to create the first item (where applicable)
- Empty states are NOT error states — they are welcoming, encouraging first action
- The CTA button opens the same modal/flow as the page's "Add New" button
- On Overview, empty sections still show their header and "See Details" link —
  only the content area shows the empty state
- All empty state strings must have i18n translation keys

#### Data availability matrix after bank connection

| Data | Available immediately | Requires user action |
|------|----------------------|---------------------|
| Transactions | Yes (imported) | No |
| Balance (current/income/expenses) | Yes (computed from transactions) | No |
| Recurring bills | Partially (auto-detected from `recurring` flag) | User confirms/adjusts |
| Budgets | No | User must create budgets |
| Pots | No | User must create pots |
| Budget suggestions | Available (based on spending history) | User reviews and accepts |

### 3.5 Forecasting Model

The app is a **forecasting tool**, not a real-time banking dashboard. The balance model:

```
current_balance = reference_balance - SUM(pots.total)
```

- `reference_balance` is stored in the `balances` table (one row per user)
- Pots reserve money from the current balance
- Income and expenses are computed from transactions (optionally filtered by month)

**Building forecasts from real data**: when a user connects their bank account, imported
transactions serve as the **historical basis** for forecasting. The user can then:

1. **Identify recurring patterns** — the app detects recurring transactions (rent, salary,
   subscriptions) from imported data and suggests them as recurring bills
2. **Create budgets from spending history** — the app suggests budget amounts based on
   actual spending per category over the last 3-6 months
3. **Define savings goals** — pots are always manual (the bank doesn't know your goals)
4. **Override and adjust** — all forecasts are user-editable. Imported data informs,
   but the user decides

### 3.6 Transaction Management

#### Manual transactions (`source: 'manual'`)
- Full CRUD: create, read, update, delete
- Fields: name, category, amount (positive = income, negative = expense), date, recurring (boolean)
- Avatar is optional (defaults to empty string)
- Recurring transactions can be income (salary, rental) or expenses (rent, subscriptions)
- Recurring definitions auto-generate at the start of each month

#### Imported transactions (`source: 'bank'`)
- Imported monthly from GoCardless — stored permanently as historical data
- The user can **re-categorize** an imported transaction (change its category) but cannot
  change amount, date, or name — those come from the bank
- The user cannot delete imported transactions
- `external_id` stores the GoCardless transaction ID (unique index prevents duplicates)
- Avatar resolved from merchant name if possible

#### Shared behavior
- Both types appear in the same transaction list
- Both are used to compute budget spent amounts
- Both are used to compute balance income/expenses
- Sorting, filtering, searching works identically on both types
- Visual indicator distinguishes manual vs imported transactions (icon or badge)

### 3.7 Budget Management

- CRUD: create, read, update, delete
- Budgets are per user, per month, per category
- A budget defines a maximum spending amount for a category
- `spent` is computed server-side (RPC `get_budgets_with_spent`) from transactions in that category and month
- Deleting a budget removes the budget only — transactions are unaffected
- The donut chart shows all budgets for the current month with their spent/remaining ratio
- "See All" on a budget navigates to Transactions filtered by that category
- Adding a budget automatically pulls in the 3 latest transactions for that category

**Forecast from bank data**: when bank transactions are imported, the app can suggest:
- Which categories have recurring spending
- What the average monthly spend per category is (last 3-6 months)
- A suggested `maximum` based on historical average + margin

### 3.8 Pot (Savings Goal) Management

- CRUD: create, read, update, delete
- A pot is a named savings goal with a target amount
- `total` tracks how much has been saved so far
- Progress = `(total / target) * 100`
- **Add money** to a pot: deducts from current balance
- **Withdraw money** from a pot: adds to current balance
- **Delete a pot**: returns `total` to current balance
- Pots are always manual — not linked to bank accounts

### 3.9 Recurring Transactions

The Frontend Mentor challenge only covers "Recurring Bills" (expenses). Our app extends
this to **all recurring transactions** — both income and expenses.

#### Recurring expenses (bills)
- Derived from transactions where `recurring = true` and `amount < 0`
- Deduplicated by vendor name (show only the latest occurrence per vendor)
- Status for the current month:
  - **Paid**: bill date has passed this month and a matching transaction exists
  - **Due Soon**: bill is due within 5 days of the current date
  - **Upcoming**: bill is due later this month but not yet due soon
- Examples: rent, subscriptions, loan payments, insurance, utilities

#### Recurring income
- Derived from transactions where `recurring = true` and `amount > 0`
- Examples: salary, freelance retainer, rental income, dividends
- In manual mode, these auto-generate at the start of each month
- Displayed in a separate section or tab on the Recurring page

#### Shared behavior
- Search by name
- Sort: Latest (earliest in month), Oldest, A-Z, Z-A, Highest, Lowest
- In manual mode: user defines recurring items via CRUD (create, edit, delete)
- In bank mode: app auto-detects recurring patterns (same merchant, similar amount,
  monthly frequency) and suggests marking them as recurring

### 3.10 Overview Page

- Current balance, income, expenses (from `get_balance` RPC)
- Pots summary: total saved across all pots + individual pot amounts
- Latest 5 transactions with "View All" link
- Budgets: donut chart + category list with spent/maximum
- Recurring bills summary: paid total, upcoming total, due soon total
- Each section links to its dedicated page ("See Details" / "View All")

---

## 4. Bank Connection (GoCardless Bank Account Data)

### 4.1 Provider

| Aspect | Detail |
|--------|--------|
| Provider | GoCardless Bank Account Data (ex-Nordigen) |
| API | `https://bankaccountdata.gocardless.com` |
| Protocol | PSD2 Open Banking |
| Access | Read-only (balances + transactions) |
| Cost | Free up to 50,000 requests/month |
| Coverage | All major French banks (BNP, SG, CA, LBP, Boursorama, etc.) |
| Auth | OAuth2 — user authenticates directly with their bank |
| GDPR | EU-hosted, PSD2-compliant |

### 4.2 Connection Flow

```
User taps "Connect Bank"
    |
    v
App calls API -> POST /bank/connect
    |
    v
API creates GoCardless requisition (institution selection)
    |
    v
User redirected to bank's OAuth page (in-app browser)
    |
    v
User authenticates with their bank
    |
    v
Bank redirects back to app with requisition ID
    |
    v
API stores requisition ID + account IDs for user
    |
    v
API fetches transactions from GoCardless
    |
    v
Transactions inserted with source='bank' + external_id
    |
    v
User sees imported transactions in the app
```

### 4.3 Data Sync

- **Initial import**: fetch all available transaction history (typically 90 days per PSD2)
- **Periodic sync**: refresh transactions on app open or manual pull-to-refresh
- **Deduplication**: `external_id` unique index prevents duplicate imports
- **Category mapping**: GoCardless provides merchant category codes (MCC) —
  map to app categories (Entertainment, Bills, Groceries, etc.)
- **Consent renewal**: PSD2 consent expires after 90 days — user must re-authenticate

### 4.4 API Endpoints (Phase 8B)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/bank/institutions` | List available banks (French institutions) |
| POST | `/bank/connect` | Create GoCardless requisition, return redirect URL |
| GET | `/bank/callback` | Handle bank OAuth callback, store account access |
| POST | `/bank/sync` | Fetch new transactions from GoCardless, insert into DB |
| GET | `/bank/accounts` | List user's connected bank accounts |
| DELETE | `/bank/accounts/:id` | Disconnect a bank account |

### 4.5 Database Additions (Phase 8B)

```sql
-- Bank connections: stores GoCardless requisition + account data
create table public.bank_connections (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  institution_id  text not null,           -- GoCardless institution ID
  institution_name text not null,          -- Display name (e.g. "BNP Paribas")
  requisition_id  text not null,           -- GoCardless requisition ID
  account_id      text not null,           -- GoCardless account ID
  status          text not null default 'active', -- active | expired | revoked
  consent_expires timestamptz,             -- PSD2 90-day consent expiry
  last_synced_at  timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_bank_conn_user on public.bank_connections(user_id);
alter table public.bank_connections enable row level security;
create policy "own_data" on public.bank_connections
  for all to authenticated
  using ((select auth.uid()) = user_id);
```

The existing `transactions` table already has `source` and `external_id` fields for this purpose.

---

## 5. CRUD Operations Summary

| Entity | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| User | via Auth | via Auth | via Auth | via Auth | Supabase Auth manages lifecycle |
| Balance | auto on signup | computed (RPC) | via pot operations | - | `reference` updated only on seed or manual adjustment |
| Transaction (manual) | yes | yes | yes | yes | Full CRUD, `source: 'manual'` |
| Transaction (bank) | via sync | yes | category only | no | Re-imported monthly, `source: 'bank'` |
| Recurring definition | yes | yes | yes | yes | Income or expense, auto-generates monthly |
| Budget | yes | yes (RPC) | yes | yes | Per user/month/category |
| Pot | yes | yes | yes | yes | Delete returns total to balance |
| Bank Connection | via OAuth | yes | status only | yes (disconnect) | Phase 8B |

---

## 6. Categories

Fixed set of categories used for transactions and budgets:

| Category | Theme Color |
|----------|-------------|
| Entertainment | #277C78 |
| Bills | #82C9D7 |
| Groceries | #82C9D7 |
| Dining Out | #F2CDAC |
| Transportation | #CAB361 |
| Personal Care | #626070 |
| Education | #826CB0 |
| Lifestyle | #97A0AC |
| Shopping | #934F6F |
| General | #97A0AC |

When importing bank transactions, GoCardless MCC codes are mapped to these categories.
Unmapped codes default to "General".

---

## 7. Business Rules

1. **Balance computation**: `current = reference - SUM(pots.total)` — always computed, never stored as `current`
2. **Add money to pot**: pot.total increases, current balance decreases by the same amount
3. **Withdraw from pot**: pot.total decreases, current balance increases by the same amount
4. **Delete pot**: pot.total is returned to current balance (reference stays, pot row deleted)
5. **Budget uniqueness**: one budget per (user, category, month) — enforced by unique constraint
6. **Transaction amounts**: positive = income, negative = expense
7. **Recurring bill dedup**: one entry per vendor name, most recent occurrence shown
8. **Due soon window**: within 5 days of current date
9. **Bank transaction immutability**: `source: 'bank'` transactions cannot be edited or deleted by the user
10. **External ID uniqueness**: `(user_id, external_id)` unique index prevents duplicate bank imports
11. **PSD2 consent expiry**: 90 days — app must prompt re-authentication before expiry

---

## 8. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Platforms | iOS (Expo), Android (Expo), Web (React Router + Vite) |
| Offline | App shows cached data (TanStack Query), mutations queue until online |
| Performance | < 2s initial load, 60fps scrolling, pagination for large lists |
| Accessibility | WCAG 2.1 AA — keyboard navigation, screen reader support, focus management |
| i18n | English + French — all user-facing strings via translation files |
| Security | Supabase RLS + API middleware user_id filter, no secrets in client code |
| Privacy | GDPR compliant, bank credentials never stored (OAuth only), data deletion on account delete |

---

## 9. Screens & Navigation

```
RootNavigator
  AuthStack (unauthenticated)
    Login
    Register
  OnboardingStack (authenticated, first-time only)
    OnboardingChoice        -- "Start from scratch" / "Connect my bank"
    SetInitialBalance       -- optional, only for "from scratch"
    BankSelection           -- GoCardless institution list (Phase 8B)
    BankAuthRedirect        -- waiting screen during bank OAuth (Phase 8B)
    ImportProgress          -- transaction import progress (Phase 8B)
    OnboardingComplete      -- success confirmation
  MainStack (authenticated, onboarding completed)
    BottomTabNavigator
      Overview
      Transactions
      Budgets
      Pots
      Recurring Bills
    Settings / Bank Accounts (Phase 8B)
  Modals
    Add/Edit/Delete Budget
    Add/Edit/Delete Pot
    Add/Withdraw Money (Pot)
    Add/Edit/Delete Transaction (manual)
    Add/Edit/Delete Recurring (income + expenses)
    Connect Bank (Phase 8B)
```

---

## 10. Implementation Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 0 | Token pipeline (Style Dictionary) | Done |
| 1 | Tailwind config + UI package refactor | Done |
| 2 | Shared package (Supabase, auth, hooks) | Done |
| 3 | Mobile app screens (read-only) | Done |
| 4 | Web app (React Router + Vite) | Done |
| 5 | Design system components | Done |
| 6 | Turborepo + CI | Planned |
| 7 | Navigation + responsive layouts | Done |
| 8A | API server + Supabase integration | Done |
| 8B | GoCardless bank connection | Planned |
| 9 | CRUD modals | Next |
| 10 | Tests (API + hooks + components) | Planned |
| 11 | Polish (animations, error recovery, perf) | Planned |
