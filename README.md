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
- **Ruby** (v3.1.x recommandé) : pour CocoaPods (iOS)
- **Xcode** (macOS) : pour iOS
- **Android Studio** : pour Android

## Installation de l'environnement (macOS)

Cette section détaille les étapes pour configurer l'environnement de développement React Native sur macOS.

### 1. Installer pnpm

```bash
npm install -g pnpm
```

### 2. Installer Ruby 3.1 via rbenv

La version système de Ruby (2.6) est trop ancienne pour CocoaPods. Ruby 3.4+ peut aussi poser des problèmes de compatibilité. **Ruby 3.1.x est recommandé.**

```bash
# Installer rbenv
brew install rbenv

# Installer Ruby 3.1.4
rbenv install 3.1.4

# Définir comme version globale
rbenv global 3.1.4

# Ajouter rbenv au shell (une seule fois)
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc && source ~/.zshrc

# Vérifier la version
ruby -v  # Doit afficher ruby 3.1.4
```

### 3. Configurer Xcode

```bash
# Sélectionner Xcode comme outil de build actif
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Ouvrir Xcode au moins une fois pour accepter la licence et installer les composants additionnels (simulateurs iOS).

### 4. Installer les dépendances du projet

```bash
# À la racine du monorepo
pnpm install
```

### 5. Installer les Pods iOS

```bash
# Dans packages/mobile
cd packages/mobile
bundle install
bundle exec pod install --project-directory=ios
```

### 6. Lancer l'app

```bash
# Depuis la racine du monorepo
pnpm --filter mobile ios      # iOS
pnpm --filter mobile android  # Android
```

### Dépannage

#### `xcodebuild` requires Xcode

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

#### `pod: command not found` ou erreurs CocoaPods

Utiliser Bundler (installé localement dans le projet) :

```bash
cd packages/mobile
bundle install
bundle exec pod install --project-directory=ios
```

#### Erreurs Ruby / `kconv` / `securerandom`

Installer Ruby 3.1.x via rbenv (voir section 2 ci-dessus).

#### Erreur "Unable to resolve module" dans le simulateur

Dans un monorepo pnpm, les dépendances sont hoistées à la racine. Metro doit être configuré pour les trouver.

Le fichier `packages/mobile/metro.config.js` doit inclure :

```js
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const monorepoRoot = path.resolve(__dirname, '../..');

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

Après modification, redémarrer Metro (`Ctrl + C` puis `pnpm --filter mobile start`).

#### Erreur "No script URL provided" au lancement de l'app

Metro n'est pas démarré. Lancer dans un terminal séparé :

```bash
pnpm --filter mobile start
```

Puis recharger l'app dans le simulateur (`Cmd + R`).

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

1. ~~Créer le dossier `packages/`~~ ✅
2. ~~Initialiser le projet React Native CLI dans `packages/mobile`~~ ✅
3. Ajouter un projet Expo dans `packages/mobile-expo`
4. Créer un package `shared` pour le code partagé
