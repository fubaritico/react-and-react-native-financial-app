# Personal Finance App - Analyse et Spécifications

> Document de travail pour le développement de l'application Personal Finance basée sur le challenge Frontend Mentor.

---

## Table des matières

1. [Analyse des écrans](#1-analyse-des-écrans)
2. [Composants UI récurrents](#2-composants-ui-récurrents)
3. [Structure de navigation](#3-structure-de-navigation)
4. [Modèle de données](#4-modèle-de-données)
5. [Solutions techniques](#5-solutions-techniques)
6. [Authentification](#6-authentification)
7. [Plan de développement](#7-plan-de-développement)

---

## 1. Analyse des écrans

### 1.1 Liste des écrans principaux

| # | Écran | Description |
|---|-------|-------------|
| 1 | **Overview** | Dashboard principal avec vue d'ensemble : solde courant, revenus, dépenses, résumé des pots, dernières transactions, budgets (donut chart), recurring bills |
| 2 | **Transactions** | Liste paginée (10/page) avec recherche, tri, filtre par catégorie |
| 3 | **Budgets** | Donut chart global + liste des budgets par catégorie avec progression et 3 dernières transactions |
| 4 | **Pots** | Liste des objectifs d'épargne avec progression, actions Add/Withdraw |
| 5 | **Recurring Bills** | Factures récurrentes avec statut (payé, à venir, due soon), recherche, tri |

### 1.2 Écrans secondaires / Modals

| Écran | Type | Description |
|-------|------|-------------|
| Add Budget | Modal | Formulaire création budget |
| Edit Budget | Modal | Formulaire modification budget |
| Delete Budget | Modal | Confirmation suppression |
| Add Pot | Modal | Formulaire création pot |
| Edit Pot | Modal | Formulaire modification pot |
| Delete Pot | Modal | Confirmation suppression |
| Add Money to Pot | Modal | Formulaire ajout d'argent |
| Withdraw from Pot | Modal | Formulaire retrait d'argent |
| Login | Screen | Connexion utilisateur |
| Register | Screen | Inscription utilisateur |

### 1.3 Détail par écran

#### Overview
- **Header** : Titre "Overview"
- **Balance Card** (dark) : Current Balance avec montant
- **Income/Expenses Cards** : Deux cartes blanches avec montants
- **Pots Summary** : Total saved + liste des pots avec montants
- **Transactions** : 5 dernières transactions avec "View All"
- **Budgets** : Donut chart + liste catégories avec montants
- **Recurring Bills** : Résumé (Paid Bills, Total Upcoming, Due Soon)

#### Transactions
- **Header** : Titre "Transactions"
- **Search Bar** : Recherche par nom
- **Sort/Filter** : Icônes tri et filtre
- **Transaction List** : Liste paginée (10 items)
  - Avatar, Nom, Catégorie, Montant (+/-), Date
- **Pagination** : Navigation entre pages

#### Budgets
- **Header** : Titre "Budgets" + bouton "+ Add New Budget"
- **Donut Chart** : Total dépensé avec breakdown par catégorie
- **Spending Summary** : Liste catégories avec barres de progression
- **Budget Cards** : Pour chaque budget
  - Catégorie avec couleur
  - Maximum mensuel
  - Barre de progression (Spent/Free)
  - Latest Spending (3 dernières transactions)
  - Bouton "See All" → filtre Transactions

#### Pots
- **Header** : Titre "Pots" + bouton "+ Add New Budget" (devrait être "Add New Pot")
- **Pot Cards** : Pour chaque pot
  - Nom avec indicateur couleur
  - Total Saved (montant)
  - Barre de progression (% du target)
  - Target amount
  - Boutons "Add Money" / "Withdraw"

#### Recurring Bills
- **Header** : Titre "Recurring Bills"
- **Total Card** (dark) : Total bills avec montant
- **Summary** : Paid Bills, Total Upcoming, Due Soon
- **Search Bar** : Recherche par nom
- **Sort** : Icône tri
- **Bills List** : Liste des factures
  - Avatar, Nom, Fréquence + jour, Statut (paid/due), Montant

---

## 2. Composants UI récurrents

### 2.1 Liste des composants

| Composant | Props principales | Utilisé dans |
|-----------|-------------------|--------------|
| `BottomTabBar` | activeTab, onTabPress | Tous les écrans |
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

### 2.2 Design Tokens (à extraire du Figma)

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

## 3. Structure de navigation

```
RootNavigator
├── AuthStack (non authentifié)
│   ├── Login
│   └── Register
│
└── MainStack (authentifié)
    └── BottomTabNavigator
        ├── Overview (index)
        ├── Transactions
        ├── Budgets
        ├── Pots
        └── RecurringBills

+ Modals (accessibles depuis MainStack)
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

## 4. Modèle de données

### 4.1 Entités identifiées (depuis data.json)

| Entité | Description | Source JSON |
|--------|-------------|-------------|
| `User` | Utilisateur de l'app | À créer (Auth) |
| `Balance` | Solde courant, revenus, dépenses | `balance` |
| `Transaction` | Transaction (dépense ou revenu) | `transactions[]` |
| `Budget` | Budget par catégorie | `budgets[]` |
| `Pot` | Objectif d'épargne | `pots[]` |

> Note : Les `RecurringBills` sont dérivées des `transactions` où `recurring: true`

### 4.2 Schéma des entités

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
  amount: number;       // 75.50 (positif = revenu, négatif = dépense)
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
  theme: string;        // "#277C78" (couleur hex)
  createdAt: Date;
  updatedAt: Date;
}

// === POT ===
interface Pot {
  id: string;
  userId: string;
  name: string;         // "Savings"
  target: number;       // 2000.00
  total: number;        // 159.00 (montant actuel épargné)
  theme: string;        // "#277C78" (couleur hex)
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

### 4.3 Données d'exemple extraites

**Categories utilisées :**
- Entertainment, Bills, Groceries, Dining Out, Transportation
- Personal Care, Education, Lifestyle, Shopping, General

**Themes (couleurs) :**
- `#277C78` - Vert (Entertainment, Savings)
- `#82C9D7` - Bleu clair (Bills, Gift)
- `#F2CDAC` - Beige (Dining Out, New Laptop)
- `#626070` - Gris (Personal Care, Concert Ticket)
- `#826CB0` - Violet (Holiday)

**Budgets initiaux :**
| Category | Maximum | Theme |
|----------|---------|-------|
| Entertainment | $50.00 | #277C78 |
| Bills | $750.00 | #82C9D7 |
| Dining Out | $75.00 | #F2CDAC |
| Personal Care | $100.00 | #626070 |

**Pots initiaux :**
| Name | Target | Total | Progress |
|------|--------|-------|----------|
| Savings | $2,000 | $159 | 7.95% |
| Concert Ticket | $150 | $110 | 73.3% |
| Gift | $150 | $110 | 73.3% |
| New Laptop | $1,000 | $10 | 1% |
| Holiday | $1,440 | $531 | 36.8% |

### 4.4 Relations

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

**Logique métier :**
- `RecurringBills` = `transactions.filter(t => t.recurring === true)`
- `Budget.spent` = somme des `transactions` du mois courant pour cette `category`
- `Pot.progress` = `(total / target) * 100`
- Ajouter argent à un Pot → déduire de `Balance.current`
- Retirer argent d'un Pot → ajouter à `Balance.current`
- Supprimer un Pot → retourner `total` à `Balance.current`

### 4.5 Opérations CRUD

| Entité | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| User | ✓ | ✓ | ✓ | ✓ | Via Auth |
| Balance | ✗ | ✓ | ✓ | ✗ | Auto-créé avec User, mis à jour via Pots |
| Transaction | ✗ | ✓ | ✗ | ✗ | Read-only (données importées) |
| Budget | ✓ | ✓ | ✓ | ✓ | Full CRUD |
| Pot | ✓ | ✓ | ✓ | ✓ | Full CRUD + Add/Withdraw |

### 4.6 Calculs dérivés (côté client)

```typescript
// Recurring Bills (filtrées depuis transactions)
const recurringBills = transactions.filter(t => t.recurring);

// Spent par budget (mois courant = Août 2024)
const getSpentForBudget = (category: Category, month: string) => {
  return transactions
    .filter(t => t.category === category && t.date.startsWith(month) && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

// Latest spending (3 dernières transactions d'une catégorie)
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
  // Paid = déjà passé ce mois, Due Soon = dans 5 jours, Upcoming = reste
};
```

---

## 5. Solutions techniques

### 5.1 Base de données

**Choix : Supabase** ✅

| Aspect | Détail |
|--------|--------|
| Type | PostgreSQL (relationnel) |
| Auth | Intégré (email/password, OAuth) |
| API | Auto-générée REST + Realtime |
| RLS | Row Level Security pour isolation par user |
| SDK | `@supabase/supabase-js` (compatible React Native) |
| Free tier | 500MB DB, 50K users, 2GB storage |

### 5.2 State Management

**Choix : Jotai + TanStack Query** ✅

| Lib | Rôle |
|-----|------|
| **Jotai** | État local atomique (UI state, modals, filters) |
| **TanStack Query** | Cache serveur, mutations, sync avec Supabase |

```typescript
// Exemple d'architecture
// atoms/ui.ts - Jotai pour UI state
const selectedCategoryAtom = atom<Category | null>(null);
const isModalOpenAtom = atom(false);

// hooks/useTransactions.ts - TanStack Query pour data
const useTransactions = () => useQuery({
  queryKey: ['transactions'],
  queryFn: () => supabase.from('transactions').select('*')
});
```

### 5.3 Navigation

**Choix : Expo Router (Expo) + React Navigation (mobile)** ✅

| App | Navigation |
|-----|------------|
| `mobile-expo` | Expo Router (file-based) |
| `mobile-expo-ejected` | Expo Router (file-based) |
| `mobile` | React Navigation (config-based) |

> Note : La logique de navigation sera similaire, seule l'implémentation diffère.

### 5.4 Autres librairies

| Besoin | Choix | Raison |
|--------|-------|--------|
| Charts (Donut) | `react-native-svg` + custom | Contrôle total sur le rendu |
| Forms | `react-hook-form` | Léger, performant |
| Validation | `zod` | TypeScript-first, inférence de types |
| Date | `date-fns` | Tree-shakeable, immutable |
| Icons | `lucide-react-native` | Moderne, cohérent |
| Styling | `twrnc` | Déjà en place dans design-system |

### 5.5 Structure des packages

```
packages/
├── design-system/          # Composants UI partagés (twrnc)
├── shared/                 # À créer : logique partagée
│   ├── api/               # Client Supabase, queries
│   ├── atoms/             # Jotai atoms
│   ├── hooks/             # TanStack Query hooks
│   ├── types/             # Types TypeScript
│   └── utils/             # Helpers (date, format, etc.)
├── mobile/                 # React Navigation
├── mobile-expo/            # Expo Router
└── mobile-expo-ejected/    # Expo Router
```

---

## 6. Authentification

### 6.1 Écrans Auth analysés

#### Login Screen
| Élément | Détail |
|---------|--------|
| Header | Logo "finance" sur fond noir |
| Card | Fond blanc avec coins arrondis |
| Titre | "Login" (h1, bold) |
| Champ Email | Label "Email", input text |
| Champ Password | Label "Password", input password + icône œil (toggle visibility) |
| Bouton | "Login" (primary, dark, full-width) |
| Lien | "Need to create an account? **Sign Up**" |

#### Sign Up Screen
| Élément | Détail |
|---------|--------|
| Header | Logo "finance" sur fond noir |
| Card | Fond blanc avec coins arrondis |
| Titre | "Sign Up" (h1, bold) |
| Champ Name | Label "Name", input text |
| Champ Email | Label "Email", input text |
| Champ Password | Label "Create Password", input password + icône œil |
| Helper text | "Passwords must be at least 8 characters" |
| Bouton | "Create Account" (primary, dark, full-width) |
| Lien | "Already have an account? **Login**" |

### 6.2 Composants Auth à créer

| Composant | Props |
|-----------|-------|
| `AuthHeader` | - (logo fixe) |
| `AuthCard` | title, children |
| `TextInput` | label, value, onChange, type, error, helperText |
| `PasswordInput` | label, value, onChange, error, helperText (avec toggle visibility) |
| `AuthButton` | title, onPress, loading |
| `AuthLink` | text, linkText, onPress |

### 6.3 Flow d'authentification

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

### 6.4 Validation des formulaires

| Champ | Règles | Message d'erreur |
|-------|--------|------------------|
| Name | Required, min 2 chars | "Name is required" |
| Email | Required, valid email format | "Please enter a valid email" |
| Password | Required, min 8 chars | "Passwords must be at least 8 characters" |

```typescript
// Schéma Zod
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

### 6.5 Fonctionnalités Auth

| Fonctionnalité | Priorité | Provider |
|----------------|----------|----------|
| Inscription (email/password) | ✅ Must have | Supabase Auth |
| Connexion (email/password) | ✅ Must have | Supabase Auth |
| Déconnexion | ✅ Must have | Supabase Auth |
| Persistance de session | ✅ Must have | Supabase + AsyncStorage |
| Récupération mot de passe | ⚡ Nice to have | Supabase Auth |
| OAuth (Google, Apple) | ⚡ Nice to have | Supabase Auth |

### 6.6 Seed des données initiales

À la première connexion d'un nouvel utilisateur, on seed les données depuis `data.json` :

```typescript
const seedInitialData = async (userId: string) => {
  // 1. Créer le Balance initial
  await supabase.from('balances').insert({
    user_id: userId,
    current: 4836.00,
    income: 3814.25,
    expenses: 1700.50
  });

  // 2. Importer les transactions
  const transactions = dataJson.transactions.map(t => ({
    ...t,
    user_id: userId
  }));
  await supabase.from('transactions').insert(transactions);

  // 3. Créer les budgets
  const budgets = dataJson.budgets.map(b => ({
    ...b,
    user_id: userId
  }));
  await supabase.from('budgets').insert(budgets);

  // 4. Créer les pots
  const pots = dataJson.pots.map(p => ({
    ...p,
    user_id: userId
  }));
  await supabase.from('pots').insert(pots);
};
```

---

## 7. Plan de développement

### Phase 1 : Setup & Infrastructure
- [ ] Choisir et configurer la base de données
- [ ] Configurer l'authentification
- [ ] Setup navigation (React Navigation / Expo Router)
- [ ] Créer les composants de base dans design-system

### Phase 2 : Authentification
- [ ] Écran Login
- [ ] Écran Register
- [ ] Protection des routes
- [ ] Persistance de session

### Phase 3 : Écrans principaux (Read)
- [ ] Overview
- [ ] Transactions (avec pagination, search, sort, filter)
- [ ] Budgets
- [ ] Pots
- [ ] Recurring Bills

### Phase 4 : CRUD Budgets
- [ ] Add Budget
- [ ] Edit Budget
- [ ] Delete Budget

### Phase 5 : CRUD Pots
- [ ] Add Pot
- [ ] Edit Pot
- [ ] Delete Pot
- [ ] Add Money
- [ ] Withdraw Money

### Phase 6 : Polish
- [ ] Animations
- [ ] Error handling
- [ ] Loading states
- [ ] Tests

---

## 8. Configuration Supabase

### 8.1 Projet créé

| Paramètre | Valeur |
|-----------|--------|
| Organisation | fubaritico |
| Nom du projet | Finance Mobile Application |
| Région | Europe |
| URL | `https://lccpruqcqalxtbddggow.supabase.co` |

### 8.2 Variables d'environnement

Fichier `.env` à la racine (gitignored) :
```bash
SUPABASE_URL=https://lccpruqcqalxtbddggow.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 8.3 Schéma SQL à créer

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

## Notes et décisions

> Section pour documenter les décisions prises au fil du développement

| Date | Décision | Raison |
|------|----------|--------|
| 24/12/2024 | Supabase cloud (Europe) | Latence optimale, free tier suffisant |
| 24/12/2024 | Jotai + TanStack Query | State atomique + cache serveur |
| 24/12/2024 | Expo Router + React Navigation | File-based pour Expo, config pour RN CLI |
| 24/12/2024 | Email/password auth only (MVP) | OAuth en nice-to-have |

---

*Document mis à jour le : 24/12/2024*
