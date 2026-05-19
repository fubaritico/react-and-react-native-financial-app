---
title: Why Custom useFormValidation Over react-hook-form
type: note
permalink: why-custom-form-hook-over-rhf
tags: [decision, forms, hooks]
---

# Why Custom useFormValidation Over react-hook-form

## Observations

- [decision] Built custom `useFormValidation` hook instead of using react-hook-form
- [reason] react-hook-form has deep DOM assumptions (ref-based registration) that conflict with React Native's controlled component model
- [reason] Cross-platform form logic needs to work identically on native and web — RHF's register/ref pattern is web-centric
- [pattern] Zod schema as single source of truth for validation rules
- [pattern] Progressive validation — only validates touched fields, so users don't see errors before interacting
- [pattern] Silent mount check — doesn't flash validation errors on initial render
- [pattern] Hook returns `{ values, errors, touched, handleChange, handleBlur, validate, isValid }` — simple, predictable API
- [location] `packages/shared/src/hooks/useFormValidation.ts` — shared across all apps
- [tradeoff] No built-in optimizations like RHF's render isolation per field — acceptable for form sizes in this app

## Relations

- uses [[Zod Schema Validation]]
- consumed_by [[SignupForm Component]]
- consumed_by [[Transaction CRUD Forms]]
