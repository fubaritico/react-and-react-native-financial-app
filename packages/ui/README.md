# @financial-app/ui

Shared UI components for the monorepo's React Native applications.

## Components

### Header

```tsx
import { Header } from '@financial-app/ui';

<Header title="My App" subtitle="Welcome" />
```

**Props:**
- `title` (string, required) — Main title
- `subtitle` (string, optional) — Subtitle

### Button

```tsx
import { Button } from '@financial-app/ui';

<Button
  title="Click"
  onPress={() => console.log('Pressed!')}
  variant="primary"
/>
```

**Props:**
- `title` (string, required) — Button text
- `onPress` (function, required) — Click callback
- `variant` ('primary' | 'secondary' | 'outline', default: 'primary')
- `disabled` (boolean, default: false)
- `style` (ViewStyle, optional)

### Card

```tsx
import { Card } from '@financial-app/ui';

<Card
  title="My card"
  text="Card description"
/>

// With custom content
<Card title="Actions">
  <Button title="Action" onPress={() => {}} />
</Card>
```

**Props:**
- `title` (string, required) — Card title
- `text` (string, optional) — Descriptive text
- `children` (ReactNode, optional) — Additional content
- `style` (ViewStyle, optional)

## Installation in an app

Add to the app's `package.json`:

```json
{
  "dependencies": {
    "@financial-app/ui": "workspace:*"
  }
}
```

Then `pnpm install` from the root.
