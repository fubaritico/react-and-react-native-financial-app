---
title: Walkthrough Onboarding Content
type: note
permalink: financial-app/features/walkthrough-onboarding-content
tags:
- walkthrough
- onboarding
- i18n
- lottie
---

# Walkthrough Onboarding Content

## Overview
6-slide onboarding walkthrough shown after mode choice + initial balance. Two versions: manual mode and bank mode. Built in Lottie Creator, rendered with DotLottie. Priority: manual mode first.

- [status] Manual mode: priority, in progress
- [status] Bank mode: planned, after Phase 8B (GoCardless)
- [format] Each slide: title + description + symbolic Lottie animation (600x600 square)
- [trigger] Shown once after onboarding, controlled by `has_seen_onboarding` in user_preferences
- relates to [[Onboarding Flow Design]]
- relates to [[Project Origin and Vision]]

## Background
- [decision] Multi-gradient background — only used on the walkthrough screen, not a shared component
- [native] Uses `experimental_backgroundImage` (RN New Architecture / Fabric)
- [web] Standard CSS `background-image`
- [gradient] 3 layers: radial top-left beige-200, radial bottom-right beige-500/30%, linear diagonal beige-100→beige-200
- [tokens] beige-100=#F8F4F0, beige-200=#E0DBD7, beige-500=#98908B
- [story] Preview at `Web/Screens/WalkthroughBackground` in Storybook

---

## Manual Mode — 6 Slides

### Slide 1 — Overview
- [en-title] Your finances at a glance
- [en-desc] Balance, income, expenses — everything starts here.
- [fr-title] Vos finances en un coup d'œil
- [fr-desc] Solde, revenus, dépenses — tout commence ici.
- [animation] Dashboard with 3 cards (balance, income, expenses) appearing

### Slide 2 — Transactions
- [en-title] Track every move
- [en-desc] Add, search, sort and filter your transactions manually.
- [fr-title] Suivez chaque mouvement
- [fr-desc] Ajoutez, recherchez, triez et filtrez vos transactions.
- [animation] Transaction list filling line by line

### Slide 3 — Budgets
- [en-title] Set your limits
- [en-desc] Create budgets by category and watch your spending in real time.
- [fr-title] Fixez vos limites
- [fr-desc] Créez des budgets par catégorie et suivez vos dépenses en temps réel.
- [animation] Donut chart filling with color segments

### Slide 4 — Pots
- [en-title] Save with purpose
- [en-desc] Set savings goals and grow your pots one deposit at a time.
- [fr-title] Épargnez avec un objectif
- [fr-desc] Fixez des objectifs et faites grandir vos pots à chaque dépôt.
- [animation] Pot/jar filling progressively with progress bar

### Slide 5 — Recurring Bills
- [en-title] Never miss a bill
- [en-desc] See what's paid, upcoming, and due soon — all in one place.
- [fr-title] Ne manquez aucune facture
- [fr-desc] Payé, à venir, bientôt dû — tout au même endroit.
- [animation] Checklist with items going from "upcoming" to "paid" (checkmark)

### Slide 6 — Settings & Categories
- [en-title] Make it yours
- [en-desc] Custom categories, currency, language — tailor the app to your needs.
- [fr-title] Personnalisez tout
- [fr-desc] Catégories, devise, langue — adaptez l'app à vos besoins.
- [animation] Grid of category icons with colors changing

---

## Bank Mode — 6 Slides

### Slide 1 — Overview
- [en-title] Your finances at a glance
- [en-desc] Balance, income, expenses — synced from your bank.
- [fr-title] Vos finances en un coup d'œil
- [fr-desc] Solde, revenus, dépenses — synchronisés depuis votre banque.
- [animation] Same dashboard with sync/bank connection symbol

### Slide 2 — Transactions
- [en-title] Your transactions, imported
- [en-desc] Bank transactions flow in automatically — search, sort and categorize.
- [fr-title] Vos transactions, importées
- [fr-desc] Les transactions arrivent automatiquement — recherchez, triez, catégorisez.
- [animation] Transactions arriving with bank logo into list

### Slide 3 — Budgets
- [en-title] Set your limits
- [en-desc] Create budgets by category — spending is tracked from your bank data.
- [fr-title] Fixez vos limites
- [fr-desc] Créez des budgets par catégorie — les dépenses viennent de vos données bancaires.
- [animation] Same donut chart

### Slide 4 — Pots
- [en-title] Save with purpose
- [en-desc] Set savings goals and grow your pots one deposit at a time.
- [fr-title] Épargnez avec un objectif
- [fr-desc] Fixez des objectifs et faites grandir vos pots à chaque dépôt.
- [animation] Identical to manual mode (pots are always manual)

### Slide 5 — Recurring Bills
- [en-title] Bills, detected
- [en-desc] Recurring payments are spotted automatically from your bank history.
- [fr-title] Factures détectées
- [fr-desc] Les paiements récurrents sont repérés automatiquement dans votre historique.
- [animation] Magnifying glass scanning transactions, bills grouping together

### Slide 6 — Settings & Categories
- [en-title] Make it yours
- [en-desc] Custom categories, currency, language — tailor the app to your needs.
- [fr-title] Personnalisez tout
- [fr-desc] Catégories, devise, langue — adaptez l'app à vos besoins.
- [animation] Identical to manual mode

## Technical — Lottie Text Layer Injection

### Font
- [font] Public Sans (Google Font) — available in Lottie Creator text layers
- [embedding] Glyphes embarqués dans le JSON via `chars` array — pas besoin de font installée côté device
- [fallback] App charge déjà Public Sans — le player peut utiliser la font système si glyphes absents

### JSON Structure — Text Layer
- [type] `layer.ty === 5` = text layer
- [path] Texte affiché : `layer.t.d.k[0].s.t`
- [key] Le nom du calque (`layer.nm`) sert de clé de placeholder
- [font-props] `layer.t.d.k[0].s.f` (font family), `.s` (size), `.fc` (fill color RGB 0-1)

### Injection Pattern
- [workflow] Export JSON (pas .lottie) → `structuredClone()` → remplacer par `layer.nm` → passer au player
- [i18n] Textes injectés via `t('walkthrough.overview.xxx')` — dynamique en/fr
- [glyphes] Placeholder dans Lottie Creator doit contenir tous les caractères possibles (0-9, €, $, é, è, ê, à, ç, etc.) pour inclure les glyphes à l'export

### Contrainte — Texte multiline
- [problem] Lottie Creator text layers sont single-line — pas de retour à la ligne natif
- [impact] Les descriptions walkthrough (15 mots) seront trop longues pour une seule ligne
- [solution] Couper chaque description en 2 lignes côté code : injecter `line1` et `line2` comme deux calques texte séparés dans chaque slide
- [naming] Convention calques : `desc_line1`, `desc_line2` par slide — ou `slide1_desc_l1`, `slide1_desc_l2` si tout dans un seul fichier
- [split] Le découpage texte se fait côté JS avant injection — fonction utilitaire qui coupe au mot le plus proche du milieu
