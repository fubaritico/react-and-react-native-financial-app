---
title: Why Atomic Design for Component Organization
type: note
permalink: why-atomic-design
tags: [decision, architecture, design-system]
---

# Why Atomic Design for Component Organization

## Observations

- [decision] Components organized using Atomic Design: atoms, molecules, organisms, templates
- [reason] Enforces a clear dependency hierarchy — atoms never import molecules, molecules never import organisms
- [reason] Makes the design system scalable — new developers immediately know where a component belongs based on its complexity
- [reason] Prevents circular dependencies at the component level — strict layering mirrors the package dependency graph
- [atoms] Indivisible elements with no internal UI dependency: Icon, Typography, Button, ColorDot, Divider, Avatar, LinkText
- [molecules] Compose atoms: TextInput, PasswordInput, SectionLink, StatCard, BalanceCard, TransactionRow
- [organisms] Autonomous sections composing molecules: Card, AuthCard, Header, PotsOverview, DataTable
- [templates] Page layouts: AuthLayout
- [pattern] Cross-level imports use `#` aliases: `#Atoms`, `#Molecules`, `#Organisms`, `#Templates`
- [pattern] Same-level sibling imports use relative paths
- [gotcha] Sub-components within an organism importing from OTHER atomic levels must use relative paths, not `#` aliases — causes ESLint import/order conflicts in nested files

## Relations

- structures [[Cross-Platform File Extension Split]]
- enforces [[Component Dependency Hierarchy]]
- inspired_by [[Brad Frost Atomic Design]]
