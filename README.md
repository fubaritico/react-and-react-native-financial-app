# React Native Monorepo

Monorepo pour applications React Native, géré avec **pnpm workspaces**.

## Structure du projet

```
react-native/
├── package.json            # Config racine du monorepo
├── pnpm-workspace.yaml     # Déclaration des workspaces pnpm
├── .gitignore              # Fichiers ignorés par Git
├── README.md               # Ce fichier
└── packages/               # Contient tous les packages
    ├── mobile/             # (à venir) App React Native sans Expo
    └── mobile-expo/        # (à venir) App React Native avec Expo
```

## Prérequis

- **Node.js** (v18+ recommandé)
- **pnpm** : `npm install -g pnpm`
- **React Native CLI** : pour le package sans Expo
- **Xcode** (macOS) : pour iOS
- **Android Studio** : pour Android

## Commandes principales

### Installer les dépendances (tous les packages)

```bash
pnpm install
```

### Lancer un script dans un package spécifique

```bash
pnpm --filter <nom-du-package> <script>
```

Exemples :

```bash
# Démarrer le bundler Metro pour l'app mobile
pnpm --filter mobile start

# Lancer l'app sur Android
pnpm --filter mobile android

# Lancer l'app sur iOS
pnpm --filter mobile ios
```

## Fonctionnement du monorepo

### pnpm workspaces

Le fichier `pnpm-workspace.yaml` déclare que tous les sous-dossiers de `packages/` sont des packages du monorepo :

```yaml
packages:
  - "packages/*"
```

**Avantages :**

- **Dépendances centralisées** : pnpm installe tout dans un seul `node_modules` à la racine (avec liens symboliques).
- **Partage de code** : les packages peuvent s'importer entre eux.
- **Commandes unifiées** : on gère tout depuis la racine avec `pnpm --filter`.

### Ajouter une dépendance à un package

```bash
# Ajouter une dépendance au package "mobile"
pnpm --filter mobile add <package-name>

# Ajouter une dépendance de dev
pnpm --filter mobile add -D <package-name>
```

### Ajouter une dépendance à la racine (outils partagés)

```bash
pnpm add -w -D <package-name>
```

## Packages prévus

| Package | Description |
|---------|-------------|
| `mobile` | App React Native CLI (sans Expo) |
| `mobile-expo` | App React Native avec Expo |
| `shared` | (optionnel) Code partagé entre les apps |

## Prochaines étapes

1. Créer le dossier `packages/`
2. Initialiser le projet React Native CLI dans `packages/mobile`
3. (Plus tard) Ajouter un projet Expo dans `packages/mobile-expo`
