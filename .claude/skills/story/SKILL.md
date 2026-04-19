---
name: story
description: Create a Storybook story for a component. Mandatory after every component creation. Use when a new component is created or when adding stories to existing components.
allowed-tools: Read Write
argument-hint: "[ComponentName]"
paths:
  - packages/ui/**
metadata:
  author: financial-app
  version: "1.0"
---

# Story

Create a Storybook story for a component. Mandatory after every component creation.

## Arguments

`$ARGUMENTS` = component name (e.g. `Button`, `Avatar`, `Card`)

## Design System Component (packages/ui)

```tsx
import { $Name } from '@financial-app/ui'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof $Name> = {
  title: 'Design System/$Name',
  component: $Name,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    // ... all controllable props
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Interactive playground
export const Playground: Story = {
  args: { variant: 'primary', size: 'md', children: 'Label' },
}

// Visual showcase — all variants/sizes/states in one render
export const Showcase: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section>
        <h3>Variants</h3>
        <div className="flex gap-3">
          <$Name variant="primary" />
          <$Name variant="secondary" />
        </div>
      </section>
      {/* sizes, disabled states, with icons, etc. */}
    </div>
  ),
}
```

## Rules

- `layout: 'centered'` for design system components
- `tags: ['autodocs']` always
- `Playground` + `Showcase` minimum — add named stories for notable variants
- Show ALL variants/sizes/states in `Showcase`
- No MSW, no `withRouter` for design system components
- Import from `@financial-app/ui`, not relative paths
