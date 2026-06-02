---
title: fix-button-type-submits-form
type: fix
permalink: financial-app/fixes/fix-button-type-submits-form
tags:
- ui
- button
- forms
- web
---

# fix-button-type-submits-form

## Symptom
In the web "Add transaction" modal, selecting a category (opening the `CategoryDropdown`) **validated the whole form** and reddened the empty name/amount fields. Native did not do this.

## Root cause
`Button.web.tsx` rendered `<button onClick={...}>` with **no `type`**. A typeless `<button>` inside a `<form>` defaults to `type="submit"`. The Dropdown trigger is a `Button`, so opening it submitted the enclosing transaction `<form>` → `onSubmit` ran `validateForm(formData)` (full validation) → empty fields errored. Native has no `<form>`, hence no bug.

## Fix
Added a web-only `type` prop to `Button` defaulting to **`'button'`** (commit 5a9e778). The only intended form submission is the programmatic `requestSubmit()` in `apps/web/app/lib/use-form-accessor.ts` (visible validation on real submit) — no Button relies on native submit.

## Observations
- [rule] Design-system buttons must default to `type="button"`; only opt into `'submit'` explicitly.
- [gotcha] `validateField` only reddens touched fields; `validateForm` reddens ALL — an accidental form submit is what triggers the latter.

## Relations
- relates to [[Transaction Type Toggle — Signed Amount Convention]]
- relates to [[icon-button-composition-pattern]]
