# Personal Finance App - Analysis & Specifications

> Working document for the development of the Personal Finance application based on the Frontend Mentor challenge.

---

## Table of Contents

1. [Screen Analysis](#1-screen-analysis)
2. [Recurring UI Components](#2-recurring-ui-components)
3. [Navigation Structure](#3-navigation-structure)
4. [Data Model](#4-data-model)
5. [Technical Solutions](#5-technical-solutions)
6. [Authentication](#6-authentication)
7. [Development Plan](#7-development-plan)

---

## 1. Screen Analysis

### 1.1 Main Screens List

| # | Screen | Description |
|---|--------|-------------|
| 1 | **Overview** | Main dashboard with overview: current balance, income, expenses, pots summary, latest transactions, budgets (donut chart), recurring bills |
| 2 | **Transactions** | Paginated list (10/page) with search, sort, filter by category |
| 3 | **Budgets** | Global donut chart + budget list by category with progress and 3 latest transactions |
| 4 | **Pots** | Savings goals list with progress, Add/Withdraw actions |
| 5 | **Recurring Bills** | Recurring bills with status (paid, upcoming, due soon), search, sort |

### 1.2 Secondary Screens / Modals

| Screen | Type | Description |
|--------|------|-------------|
| Add Budget | Modal | Budget creation form |
| Edit Budget | Modal | Budget modification form |
| Delete Budget | Modal | Deletion confirmation |
| Add Pot | Modal | Pot creation form |
| Edit Pot | Modal | Pot modification form |
| Delete Pot | Modal | Deletion confirmation |
| Add Money to Pot | Modal | Add money form |
| Withdraw from Pot | Modal | Withdraw money form |
| Login | Screen | User login |
| Register | Screen | User registration |

### 1.3 Screen Details

#### Overview
- **Header**: Title "Overview"
- **Balance Card** (dark): Current Balance with amount
- **Income/Expenses Cards**: Two white cards with amounts
- **Pots Summary**: Total saved + pots list with amounts
- **Transactions**: 5 latest transactions with "View All"
- **Budgets**: Donut chart + category list with amounts
- **Recurring Bills**: Summary (Paid Bills, Total Upcoming, Due Soon)

#### Transactions
- **Header**: Title "Transactions"
- **Search Bar**: Search by name
- **Sort/Filter**: Sort and filter icons
- **Transaction List**: Paginated list (10 items)
  - Avatar, Name, Category, Amount (+/-), Date
- **Pagination**: Page navigation

#### Budgets
- **Header**: Title "Budgets" + "+ Add New Budget" button
- **Donut Chart**: Total spent with category breakdown
- **Spending Summary**: Category list with progress bars
- **Budget Cards**: For each budget
  - Category with color
  - Monthly maximum
  - Progress bar (Spent/Free)
  - Latest Spending (3 latest transactions)
  - "See All" button → filters Transactions

#### Pots
- **Header**: Title "Pots" + "+ Add New Pot" button
- **Pot Cards**: For each pot
  - Name with color indicator
  - Total Saved (amount)
  - Progress bar (% of target)
  - Target amount
  - "Add Money" / "Withdraw" buttons

#### Recurring Bills
- **Header**: Title "Recurring Bills"
- **Total Card** (dark): Total bills with amount
- **Summary**: Paid Bills, Total Upcoming, Due Soon
- **Search Bar**: Search by name
- **Sort**: Sort icon
- **Bills List**: Bills list
  - Avatar, Name, Frequency + day, Status (paid/due), Amount

---

## 2. Recurring UI Components

### 2.1 Components List

| Component | Main Props | Used In |
|-----------|------------|---------|
| `BottomTabBar` | activeTab, onTabPress | All screens |
| `Card` | title, children, style | Overview, Budgets, Pots, Bills |
| `SummaryCard` | title, amount, variant (dark/light) | Overview, Bills |
| `TransactionItem` | avatar, name, category, amount, date | Overview, Transactions, Budgets |
| `ProgressBar` | current, max, color | Pots, Budgets |
| `DonutChart` | data[], total | Overview, Budgets |
| `SearchInput` | value, onChange, placeholder | Transactions, Bills |
| `SortButton` | options[], selected, onSelect | Transactions, Bills |
| `FilterButton` | categories[], selected, onSelect | Transactions |
| `Button` | title, variant, onPress | Pots, Budgets, Auth |
| `CategoryBadge` | name, color | Transactions, Budgets |
| `Pagination` | currentPage, totalPages, onPageChange | Transactions |
| `Modal` | visible, onClose, children | CRUD operations |
| `Input` | label, value, onChange, error | Forms |
| `Avatar` | source, size | Transactions, Bills |

### 2.2 Design Tokens (to extract from Figma)

```
Colors:
- Primary (dark): #201F24
- Background: #F8F4F0
- White: #FFFFFF
- Green (income): #277C78
- Red (expense/due): #C94736
- Categories:
  - Entertainment: #277C78
  - Bills: #82C9D7
  - Dining Out: #F2CDAC
  - Personal Care: #626070
  - General: #97A0AC
  - ...

Typography:
- Font: Public Sans (Google Fonts)
- Sizes: 32px (h1), 24px (h2), 14px (body), 12px (caption)
```

---

## 3. Navigation Structure

```
RootNavigator
├── AuthStack (not authenticated)
│   ├── Login
│   └── Register
│
└── MainStack (authenticated)
    └── BottomTabNavigator
        ├── Overview (index)
        ├── Transactions
        ├── Budgets
        ├── Pots
        └── RecurringBills

+ Modals (accessible from MainStack)
  ├── AddBudgetModal
  ├── EditBudgetModal
  ├── DeleteBudgetModal
  ├── AddPotModal
  ├── EditPotModal
  ├── DeletePotModal
  ├── AddMoneyModal
  └── WithdrawMoneyModal
```

---

## 4. Data Model

### 4.1 Identified Entities (from data.json)

| Entity | Description | JSON Source |
|--------|-------------|-------------|
| `User` | App user | To create (Auth) |
| `Balance` | Current balance, income, expenses | `balance` |
| `Transaction` | Transaction (expense or income) | `transactions[]` |
| `Budget` | Budget by category | `budgets[]` |
| `Pot` | Savings goal | `pots[]` |

> Note: `RecurringBills` are derived from `transactions` where `recurring: true`

### 4.2 Entity Schema

```typescript
// === BALANCE ===
interface Balance {
  id: string;
  userId: string;
  current: number;      // 4836.00
  income: number;       // 3814.25
  expenses: number;     // 1700.50
  updatedAt: Date;
}

// === TRANSACTION ===
interface Transaction {
  id: string;
  userId: string;
  avatar: string;       // "./assets/images/avatars/emma-richardson.jpg"
  name: string;         // "Emma Richardson"
  category: Category;   // "General"
  date: string;         // "2024-08-19T14:23:11Z" (ISO 8601)
  amount: number;       // 75.50 (positive = income, negative = expense)
  recurring: boolean;   // false
}

// === CATEGORY (enum) ===
type Category = 
  | "Entertainment"
  | "Bills"
  | "Groceries"
  | "Dining Out"
  | "Transportation"
  | "Personal Care"
  | "Education"
  | "Lifestyle"
  | "Shopping"
  | "General";

// === BUDGET ===
interface Budget {
  id: string;
  userId: string;
  category: Category;   // "Entertainment"
  maximum: number;      // 50.00
  theme: string;        // "#277C78" (hex color)
  createdAt: Date;
  updatedAt: Date;
}

// === POT ===
interface Pot {
  id: string;
  userId: string;
  name: string;         // "Savings"
  target: number;       // 2000.00
  total: number;        // 159.00 (current saved amount)
  theme: string;        // "#277C78" (hex color)
  createdAt: Date;
  updatedAt: Date;
}

// === USER ===
interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: Date;
}
```

### 4.3 Extracted Sample Data

**Used Categories:**
- Entertainment, Bills, Groceries, Dining Out, Transportation
- Personal Care, Education, Lifestyle, Shopping, General

**Themes (colors):**
- `#277C78` - Green (Entertainment, Savings)
- `#82C9D7` - Light Blue (Bills, Gift)
- `#F2CDAC` - Beige (Dining Out, New Laptop)
- `#626070` - Gray (Personal Care, Concert Ticket)
- `#826CB0` - Purple (Holiday)

**Initial Budgets:**
| Category | Maximum | Theme |
|----------|---------|-------|
| Entertainment | $50.00 | #277C78 |
| Bills | $750.00 | #82C9D7 |
| Dining Out | $75.00 | #F2CDAC |
| Personal Care | $100.00 | #626070 |

**Initial Pots:**
| Name | Target | Total | Progress |
|------|--------|-------|----------|
| Savings | $2,000 | $159 | 7.95% |
| Concert Ticket | $150 | $110 | 73.3% |
| Gift | $150 | $110 | 73.3% |
| New Laptop | $1,000 | $10 | 1% |
| Holiday | $1,440 | $531 | 36.8% |

### 4.4 Relationships

```
User (1) ──────────── (1) Balance
     │
     ├── (1) ──────── (N) Transaction
     │                      │
     │                      └── category ──► Budget (via category match)
     │
     ├── (1) ──────── (N) Budget
     │
     └── (1) ──────── (N) Pot
```

**Business Logic:**
- `RecurringBills` = `transactions.filter(t => t.recurring === true)`
- `Budget.spent` = sum of current month `transactions` for this `category`
- `Pot.progress` = `(total / target) * 100`
- Add money to Pot → deduct from `Balance.current`
- Withdraw money from Pot → add to `Balance.current`
- Delete a Pot → return `total` to `Balance.current`

### 4.5 CRUD Operations

| Entity | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| User | ✓ | ✓ | ✓ | ✓ | Via Auth |
| Balance | ✗ | ✓ | ✓ | ✗ | Auto-created with User, updated via Pots |
| Transaction | ✗ | ✓ | ✗ | ✗ | Read-only (imported data) |
| Budget | ✓ | ✓ | ✓ | ✓ | Full CRUD |
| Pot | ✓ | ✓ | ✓ | ✓ | Full CRUD + Add/Withdraw |

### 4.6 Derived Calculations (client-side)

```typescript
// Recurring Bills (filtered from transactions)
const recurringBills = transactions.filter(t => t.recurring);

// Spent per budget (current month = August 2024)
const getSpentForBudget = (category: Category, month: string) => {
  return transactions
    .filter(t => t.category === category && t.date.startsWith(month) && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

// Latest spending (3 latest transactions for a category)
const getLatestSpending = (category: Category, limit = 3) => {
  return transactions
    .filter(t => t.category === category && t.amount < 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

// Bills status
const getBillStatus = (bill: Transaction, currentDate: Date) => {
  const billDate = new Date(bill.date);
  const dayOfMonth = billDate.getDate();
  // Paid = already passed this month, Due Soon = within 5 days, Upcoming = rest
};
```

---

## 5. Technical Solutions

### 5.1 Database

**Choice: Supabase** ✅

| Aspect | Detail |
|--------|--------|
| Type | PostgreSQL (relational) |
| Auth | Built-in (email/password, OAuth) |
| API | Auto-generated REST + Realtime |
| RLS | Row Level Security for user isolation |
| SDK | `@supabase/supabase-js` (React Native compatible) |
| Free tier | 500MB DB, 50K users, 2GB storage |

### 5.2 State Management

**Choice: Jotai + TanStack Query** ✅

| Lib | Role |
|-----|------|
| **Jotai** | Atomic local state (UI state, modals, filters) |
| **TanStack Query** | Server cache, mutations, sync with Supabase |

```typescript
// Architecture example
// atoms/ui.ts - Jotai for UI state
const selectedCategoryAtom = atom<Category | null>(null);
const isModalOpenAtom = atom(false);

// hooks/useTransactions.ts - TanStack Query for data
const useTransactions = () => useQuery({
  queryKey: ['transactions'],
  queryFn: () => supabase.from('transactions').select('*')
});
```

### 5.3 Navigation

**Choice: Expo Router (Expo) + React Navigation (mobile)** ✅

| App | Navigation |
|-----|------------|
| `mobile-expo` | Expo Router (file-based) |
| `mobile-expo-ejected` | Expo Router (file-based) |
| `mobile` | React Navigation (config-based) |

> Note: Navigation logic will be similar, only implementation differs.

### 5.4 Other Libraries

| Need | Choice | Reason |
|------|--------|--------|
| Charts (Donut) | `react-native-svg` + custom | Full control over rendering |
| Forms | `react-hook-form` | Lightweight, performant |
| Validation | `zod` | TypeScript-first, type inference |
| Date | `date-fns` | Tree-shakeable, immutable |
| Icons | `lucide-react-native` | Modern, consistent |
| Styling | `twrnc` | Already in place in design-system |

### 5.5 Package Structure

```
packages/
├── design-tokens/          # 🆕 Shared tokens (Style Dictionary)
│   ├── tokens.json        # DTCG format source
│   ├── style-dictionary.config.js
│   └── build/
│       ├── tailwind.theme.js  # For twrnc
│       └── tokens.ts          # For direct TS usage
│
├── design-system/          # Mobile UI Components (React Native + twrnc)
│   └── src/
│       ├── components/    # Button, Card, Input...
│       └── index.ts
│
├── design-system-web/      # 🔮 Future: Web UI Components (React DOM)
│
├── shared/                 # Shared business logic (mobile + web)
│   ├── api/               # Supabase client, CRUD services
│   ├── atoms/             # Jotai atoms (global state)
│   ├── hooks/             # TanStack Query hooks
│   ├── types/             # TypeScript types
│   └── utils/             # Helpers (date, format, currency...)
│
├── screens/                # 🆕 Shared Screens/Pages (UI without navigation)
│   ├── auth/              # LoginScreen, SignUpScreen
│   ├── overview/          # OverviewScreen
│   ├── transactions/      # TransactionsScreen
│   ├── budgets/           # BudgetsScreen, AddBudgetModal...
│   ├── pots/              # PotsScreen, AddPotModal...
│   └── bills/             # RecurringBillsScreen
│
├── mobile/                 # React Navigation App (wiring only)
├── mobile-expo/            # Expo Router App (wiring only)
├── mobile-expo-ejected/    # Expo Router App (wiring only)
└── web/                    # 🔮 Future: Next.js / Vite (responsive)
```

### 5.6 Navigation Agnostic

Screens in `screens/` must **not** import navigation libs. We use callback injection:

```typescript
// screens/overview/OverviewScreen.tsx
interface OverviewScreenProps {
  onNavigateToTransactions: () => void;
  onNavigateToBudgets: () => void;
  onNavigateToPots: () => void;
  onNavigateToBills: () => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onNavigateToTransactions,
  onNavigateToBudgets,
  ...
}) => {
  return (
    <View>
      <TransactionsSummary onSeeAll={onNavigateToTransactions} />
      <BudgetsSummary onSeeAll={onNavigateToBudgets} />
    </View>
  );
};
```

```typescript
// mobile-expo/app/(tabs)/index.tsx (Expo Router)
import { OverviewScreen } from '@monorepo/screens';
import { router } from 'expo-router';

export default function Overview() {
  return (
    <OverviewScreen
      onNavigateToTransactions={() => router.push('/transactions')}
      onNavigateToBudgets={() => router.push('/budgets')}
    />
  );
}
```

```typescript
// mobile/src/screens/Overview.tsx (React Navigation)
import { OverviewScreen } from '@monorepo/screens';
import { useNavigation } from '@react-navigation/native';

export default function Overview() {
  const navigation = useNavigation();
  return (
    <OverviewScreen
      onNavigateToTransactions={() => navigation.navigate('Transactions')}
      onNavigateToBudgets={() => navigation.navigate('Budgets')}
    />
  );
}
```

### 5.7 Design Tokens with Style Dictionary

Single source of tokens (colors, spacing, typography) in DTCG format:

```json
// design-tokens/tokens.json
{
  "color": {
    "primary": {
      "dark": { "$value": "#201F24", "$type": "color" },
      "beige": { "$value": "#F8F4F0", "$type": "color" }
    },
    "accent": {
      "green": { "$value": "#277C78", "$type": "color" },
      "red": { "$value": "#C94736", "$type": "color" }
    }
  },
  "spacing": {
    "xs": { "$value": "4px", "$type": "dimension" },
    "sm": { "$value": "8px", "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" },
    "lg": { "$value": "24px", "$type": "dimension" }
  }
}
```

Style Dictionary generates outputs for each platform:
- `tailwind.theme.js` → for `twrnc` (mobile) and Tailwind CSS (web)
- `tokens.ts` → for direct TypeScript usage
- `variables.css` → for CSS custom properties (web)

### 5.8 Package Responsibilities

| Package | Responsibility | Dependencies |
|---------|---------------|--------------|
| `design-tokens` | Tokens (colors, spacing, typo) | None (pure JS/TS) |
| `design-system` | Mobile UI Components | `design-tokens`, `react-native`, `twrnc` |
| `design-system-web` | Web UI Components (future) | `design-tokens`, `react`, `tailwindcss` |
| `shared` | Business logic, API, state | `design-tokens` (optional) |
| `screens` | Complete screens (no nav) | `design-system`, `shared` |
| `mobile*` | Mobile navigation wiring | `screens`, `shared` |
| `web` | Web navigation wiring (future) | `screens` or `screens-web`, `shared` |

### 5.9 Detailed `shared/` Package Structure

The `shared/` package contains **all business logic** shared between mobile and web:

```
packages/shared/
├── api/                    # Supabase client + CRUD services
│   ├── supabase.ts        # Initialized client
│   ├── auth.ts            # signIn, signUp, signOut
│   ├── transactions.ts    # getTransactions, getRecurringBills
│   ├── budgets.ts         # getBudgets, createBudget, updateBudget, deleteBudget
│   ├── pots.ts            # getPots, createPot, updatePot, deletePot, addMoney, withdraw
│   └── balance.ts         # getBalance, updateBalance
│
├── hooks/                  # TanStack Query hooks
│   ├── useAuth.ts         # useUser, useSession
│   ├── useTransactions.ts # useTransactions, useRecurringBills
│   ├── useBudgets.ts      # useBudgets, useBudgetMutations
│   ├── usePots.ts         # usePots, usePotMutations
│   └── useBalance.ts      # useBalance
│
├── atoms/                  # Jotai atoms (global UI state)
│   ├── filters.ts         # selectedCategory, searchQuery, sortOrder
│   ├── modals.ts          # isAddBudgetOpen, isAddPotOpen...
│   └── ui.ts              # activeTab, theme...
│
├── types/                  # TypeScript types
│   ├── models.ts          # Transaction, Budget, Pot, Balance, User
│   ├── api.ts             # API responses, errors
│   └── navigation.ts      # Screen params types
│
└── utils/                  # Pure helpers (no platform dependency)
    ├── currency.ts        # formatCurrency, parseCurrency
    ├── date.ts            # formatDate, isToday, getDaysUntil
    ├── budget.ts          # calculateSpent, calculateRemaining
    ├── pot.ts             # calculateProgress
    └── bills.ts           # getBillStatus (paid, upcoming, due soon)
```

### 5.10 Hexagonal Architecture

The architecture follows the **hexagonal architecture** principle (ports & adapters):

```
                    ┌─────────────────────────────────────┐
                    │           DOMAIN / BUSINESS         │
                    │            (shared/)                │
                    │                                     │
                    │  • Supabase API (CRUD services)     │
                    │  • TanStack Query hooks             │
                    │  • Jotai atoms                      │
                    │  • TypeScript types                 │
                    │  • Utils (date, currency, etc.)     │
                    │                                     │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
          ┌─────────▼─────────┐       ┌──────────▼──────────┐
          │     ADAPTER       │       │      ADAPTER        │
          │     MOBILE        │       │        WEB          │
          │                   │       │                     │
          │ • design-system   │       │ • design-system-web │
          │ • screens/        │       │ • screens-web/      │
          │ • mobile*         │       │ • web/              │
          └───────────────────┘       └─────────────────────┘
```

**Why separate mobile and web?**
- Different events: `onPress` vs `onClick`, `onLongPress` vs `onContextMenu`
- Interactions: no hover on mobile, touch gestures vs mouse
- Layouts: responsive web vs fixed mobile dimensions
- Native components: `ScrollView` vs `<div>` with overflow
- Performance: optimized bundle per platform

### 5.11 Business Logic Sharing

| Element | Shared (`shared/`) | Mobile | Web |
|---------|---------------------|--------|-----|
| Supabase API | ✅ | - | - |
| TanStack Query hooks | ✅ | - | - |
| Jotai atoms | ✅ | - | - |
| TypeScript types | ✅ | - | - |
| Utils (date, currency) | ✅ | - | - |
| Design tokens | ✅ | - | - |
| UI Components | - | `design-system` | `design-system-web` |
| Screens/Pages | - | `screens/` | `screens-web/` |
| Navigation | - | Expo Router / React Nav | Next.js Router |

### 5.12 Concrete Example: Overview

```typescript
// ══════════════════════════════════════════════════════════
// DOMAIN (shared/) - Shared business logic
// ══════════════════════════════════════════════════════════

// shared/hooks/useOverviewData.ts
export const useOverviewData = () => {
  const balance = useBalance();
  const transactions = useTransactions({ limit: 5 });
  const budgets = useBudgets();
  const pots = usePots();
  
  const recurringBills = useMemo(() => ({
    paid: transactions.data?.filter(t => t.recurring && isPaid(t)),
    upcoming: transactions.data?.filter(t => t.recurring && isUpcoming(t)),
    dueSoon: transactions.data?.filter(t => t.recurring && isDueSoon(t)),
  }), [transactions.data]);

  return { balance, transactions, budgets, pots, recurringBills };
};
```

```typescript
// ══════════════════════════════════════════════════════════
// MOBILE ADAPTER (screens/)
// ══════════════════════════════════════════════════════════

// screens/overview/OverviewScreen.tsx
import { View, ScrollView } from 'react-native';
import { BalanceCard, TransactionsList } from '@monorepo/design-system';
import { useOverviewData } from '@monorepo/shared';

interface OverviewScreenProps {
  onNavigateToTransactions: () => void;
  onNavigateToBudgets: () => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = (props) => {
  const { balance, transactions, budgets } = useOverviewData();

  return (
    <ScrollView>
      <BalanceCard data={balance.data} />
      <TransactionsList 
        data={transactions.data} 
        onSeeAll={props.onNavigateToTransactions}  // onPress (touch)
      />
    </ScrollView>
  );
};
```

```typescript
// ══════════════════════════════════════════════════════════
// WEB ADAPTER (screens-web/)
// ══════════════════════════════════════════════════════════

// screens-web/overview/OverviewPage.tsx
import { BalanceCard, TransactionsList } from '@monorepo/design-system-web';
import { useOverviewData } from '@monorepo/shared';

interface OverviewPageProps {
  onNavigateToTransactions: () => void;
  onNavigateToBudgets: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = (props) => {
  const { balance, transactions, budgets } = useOverviewData();

  return (
    <div className="container mx-auto p-4">
      <BalanceCard data={balance.data} />
      <TransactionsList 
        data={transactions.data} 
        onSeeAll={props.onNavigateToTransactions}  // onClick (mouse)
        onRowHover={(id) => highlightRow(id)}      // hover (web only)
      />
    </div>
  );
};
```

**Result**: 
- Business logic (`useOverviewData`) is written **once**
- UI is adapted to each platform (events, layout, native components)

---

## 6. Authentication

### 6.1 Analyzed Auth Screens

#### Login Screen
| Element | Detail |
|---------|--------|
| Header | "finance" logo on black background |
| Card | White background with rounded corners |
| Title | "Login" (h1, bold) |
| Email Field | Label "Email", text input |
| Password Field | Label "Password", password input + eye icon (toggle visibility) |
| Button | "Login" (primary, dark, full-width) |
| Link | "Need to create an account? **Sign Up**" |

#### Sign Up Screen
| Element | Detail |
|---------|--------|
| Header | "finance" logo on black background |
| Card | White background with rounded corners |
| Title | "Sign Up" (h1, bold) |
| Name Field | Label "Name", text input |
| Email Field | Label "Email", text input |
| Password Field | Label "Create Password", password input + eye icon |
| Helper text | "Passwords must be at least 8 characters" |
| Button | "Create Account" (primary, dark, full-width) |
| Link | "Already have an account? **Login**" |

### 6.2 Auth Components to Create

| Component | Props |
|-----------|-------|
| `AuthHeader` | - (fixed logo) |
| `AuthCard` | title, children |
| `TextInput` | label, value, onChange, type, error, helperText |
| `PasswordInput` | label, value, onChange, error, helperText (with toggle visibility) |
| `AuthButton` | title, onPress, loading |
| `AuthLink` | text, linkText, onPress |

### 6.3 Authentication Flow

```
App Launch
    │
    ▼
Check Auth State (Supabase session)
    │
    ├── Not Authenticated ──► Login Screen
    │                              │
    │                              ├── Submit Login
    │                              │      │
    │                              │      ├── Success ──► Seed initial data ──► Main App
    │                              │      │
    │                              │      └── Error ──► Show error message
    │                              │
    │                              └── Tap "Sign Up" ──► Sign Up Screen
    │                                                          │
    │                                                          ├── Submit Sign Up
    │                                                          │      │
    │                                                          │      ├── Success ──► Seed initial data ──► Main App
    │                                                          │      │
    │                                                          │      └── Error ──► Show error message
    │                                                          │
    │                                                          └── Tap "Login" ──► Login Screen
    │
    └── Authenticated ──► Main App
```

### 6.4 Form Validation

| Field | Rules | Error Message |
|-------|-------|---------------|
| Name | Required, min 2 chars | "Name is required" |
| Email | Required, valid email format | "Please enter a valid email" |
| Password | Required, min 8 chars | "Passwords must be at least 8 characters" |

```typescript
// Zod Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Passwords must be at least 8 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Passwords must be at least 8 characters"),
});
```

### 6.5 Auth Features

| Feature | Priority | Provider |
|---------|----------|----------|
| Sign up (email/password) | ✅ Must have | Supabase Auth |
| Sign in (email/password) | ✅ Must have | Supabase Auth |
| Sign out | ✅ Must have | Supabase Auth |
| Session persistence | ✅ Must have | Supabase + AsyncStorage |
| Password recovery | ⚡ Nice to have | Supabase Auth |
| OAuth (Google, Apple) | ⚡ Nice to have | Supabase Auth |

### 6.6 Initial Data Seeding

On first login for a new user, seed data from `data.json`:

```typescript
const seedInitialData = async (userId: string) => {
  // 1. Create initial Balance
  await supabase.from('balances').insert({
    user_id: userId,
    current: 4836.00,
    income: 3814.25,
    expenses: 1700.50
  });

  // 2. Import transactions
  const transactions = dataJson.transactions.map(t => ({
    ...t,
    user_id: userId
  }));
  await supabase.from('transactions').insert(transactions);

  // 3. Create budgets
  const budgets = dataJson.budgets.map(b => ({
    ...b,
    user_id: userId
  }));
  await supabase.from('budgets').insert(budgets);

  // 4. Create pots
  const pots = dataJson.pots.map(p => ({
    ...p,
    user_id: userId
  }));
  await supabase.from('pots').insert(pots);
};
```

---

## 7. Development Plan

### Phase 1: Setup & Infrastructure
- [ ] Choose and configure database
- [ ] Configure authentication
- [ ] Setup navigation (React Navigation / Expo Router)
- [ ] Create base components in design-system

### Phase 2: Authentication
- [ ] Login screen
- [ ] Register screen
- [ ] Route protection
- [ ] Session persistence

### Phase 3: Main Screens (Read)
- [ ] Overview
- [ ] Transactions (with pagination, search, sort, filter)
- [ ] Budgets
- [ ] Pots
- [ ] Recurring Bills

### Phase 4: Budgets CRUD
- [ ] Add Budget
- [ ] Edit Budget
- [ ] Delete Budget

### Phase 5: Pots CRUD
- [ ] Add Pot
- [ ] Edit Pot
- [ ] Delete Pot
- [ ] Add Money
- [ ] Withdraw Money

### Phase 6: Polish
- [ ] Animations
- [ ] Error handling
- [ ] Loading states
- [ ] Tests

---

## 8. Supabase Configuration

### 8.1 Project Created

| Parameter | Value |
|-----------|-------|
| Organization | fubaritico |
| Project name | Finance Mobile Application |
| Region | Europe |
| URL | `https://lccpruqcqalxtbddggow.supabase.co` |

### 8.2 Environment Variables

`.env` file at root (gitignored):
```bash
SUPABASE_URL=https://lccpruqcqalxtbddggow.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 8.3 SQL Schema to Create

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Balances table
CREATE TABLE balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current DECIMAL(12,2) NOT NULL DEFAULT 0,
  income DECIMAL(12,2) NOT NULL DEFAULT 0,
  expenses DECIMAL(12,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  avatar TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budgets table
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  maximum DECIMAL(12,2) NOT NULL,
  theme TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category)
);

-- Pots table
CREATE TABLE pots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  theme TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pots ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own balance" ON balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own balance" ON balances FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own balance" ON balances FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own budgets" ON budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON budgets FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own pots" ON pots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pots" ON pots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pots" ON pots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pots" ON pots FOR DELETE USING (auth.uid() = user_id);
```

---

## Notes and Decisions

> Section to document decisions made during development

| Date | Decision | Reason |
|------|----------|--------|
| 24/12/2024 | Supabase cloud (Europe) | Optimal latency, sufficient free tier |
| 24/12/2024 | Jotai + TanStack Query | Atomic state + server cache |
| 24/12/2024 | Expo Router + React Navigation | File-based for Expo, config for RN CLI |
| 24/12/2024 | Email/password auth only (MVP) | OAuth as nice-to-have |
| 25/12/2024 | Separate `screens/` package | Reusable screens between Expo Router and React Navigation |
| 25/12/2024 | Navigation agnostic (callbacks) | Screens don't depend on navigation lib |
| 25/12/2024 | `design-tokens/` package with Style Dictionary | Single source of tokens, multi-output (Tailwind, TS, CSS) |
| 25/12/2024 | `design-system` mobile only for now | `design-system-web` will be created when web arrives |
| 25/12/2024 | Future responsive web preparation | Architecture designed for `react-native-web` or native web components |
| 25/12/2024 | Hexagonal architecture | Domain (`shared/`) separated from adapters (mobile/web UI) |
| 25/12/2024 | `screens-web/` separate from `screens/` | Different events (hover, click vs touch), UX optimized per platform |

---

## Next Steps

1. [ ] Create Supabase tables (SQL Editor)
2. [ ] Create `design-tokens/` package with Style Dictionary
3. [ ] Create `shared/` package (api, atoms, hooks, types, utils)
4. [ ] Create `screens/` package
5. [ ] Implement Auth (Login, Sign Up)
6. [ ] Develop main screens

---

*Document updated: 25/12/2024*
