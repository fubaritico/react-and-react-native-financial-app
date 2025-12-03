# @monorepo/design-system

Composants UI partagés pour les applications React Native du monorepo.

## Composants

### Header

```tsx
import { Header } from '@monorepo/design-system';

<Header title="Mon App" subtitle="Bienvenue" />
```

**Props:**
- `title` (string, required) — Titre principal
- `subtitle` (string, optional) — Sous-titre

### Button

```tsx
import { Button } from '@monorepo/design-system';

<Button 
  title="Cliquer" 
  onPress={() => console.log('Pressed!')} 
  variant="primary"
/>
```

**Props:**
- `title` (string, required) — Texte du bouton
- `onPress` (function, required) — Callback au clic
- `variant` ('primary' | 'secondary' | 'outline', default: 'primary')
- `disabled` (boolean, default: false)
- `style` (ViewStyle, optional)

### Card

```tsx
import { Card } from '@monorepo/design-system';

<Card 
  title="Ma carte" 
  text="Description de la carte"
/>

// Avec contenu custom
<Card title="Actions">
  <Button title="Action" onPress={() => {}} />
</Card>
```

**Props:**
- `title` (string, required) — Titre de la carte
- `text` (string, optional) — Texte descriptif
- `children` (ReactNode, optional) — Contenu additionnel
- `style` (ViewStyle, optional)

## Installation dans une app

Ajouter dans le `package.json` de l'app :

```json
{
  "dependencies": {
    "@monorepo/design-system": "workspace:*"
  }
}
```

Puis `pnpm install` à la racine.
