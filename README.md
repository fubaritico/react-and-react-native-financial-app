# React & React Native Financial App

Monorepo pour applications React Native, géré avec **pnpm workspaces**.

## Structure du projet

```
react-native/
├── package.json            # Config racine du monorepo
├── pnpm-workspace.yaml     # Déclaration des workspaces pnpm
├── .gitignore              # Fichiers ignorés par Git
├── README.md               # Ce fichier
├── apps/                   # Applications
│   ├── mobile/             # App React Native CLI (sans Expo)
│   ├── mobile-expo/        # App React Native avec Expo (canonical)
│   └── mobile-expo-ejected/ # App Expo ejected
└── packages/               # Packages partagés
    └── ui/      # @financial-app/ui
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

### 3. Configurer Xcode (iOS)

```bash
# Sélectionner Xcode comme outil de build actif
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Ouvrir Xcode au moins une fois pour accepter la licence et installer les composants additionnels (simulateurs iOS).

### 4. Configurer Android Studio (Android)

1. Installer [Android Studio](https://developer.android.com/studio)
2. Ouvrir Android Studio → **More Actions** → **Virtual Device Manager**
3. Créer un émulateur (ex: Pixel 7, API 34)

Configurer les variables d'environnement :

```bash
# Java 17 (requis par Gradle 9)
brew install openjdk@17
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc

# Android SDK
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

Vérifier :

```bash
java -version   # Doit afficher openjdk 17.x.x
adb --version   # Doit afficher Android Debug Bridge
```

### 5. Installer les dépendances du projet

```bash
# À la racine du monorepo
pnpm install
```

### 6. Installer les Pods iOS

```bash
# Dans apps/mobile
cd apps/mobile
bundle install
bundle exec pod install --project-directory=ios
```

### 7. Lancer l'app

```bash
# Démarrer Metro (dans un terminal dédié)
pnpm --filter mobile-financial-app start

# Dans un autre terminal :
pnpm --filter mobile-financial-app ios      # iOS (simulateur)
pnpm --filter mobile-financial-app android  # Android (émulateur doit être lancé)
```

---

## Alignement des versions React Native (0.81.5)

### Pourquoi React Native 0.81.5 ?

Dans ce monorepo, nous avons plusieurs apps :
- **`mobile`** : React Native CLI (sans Expo)
- **`mobile-expo`** : Expo managed (SDK 54)
- **`mobile-expo-ejected`** : Expo bare/ejected
- **`ui`** : Composants partagés avec `twrnc` (Tailwind pour RN)

**Expo SDK 54 impose React Native 0.81.x**. Pour éviter les conflits de versions multiples dans le monorepo (qui causent des erreurs "Invalid hook call" et des crashes), toutes les apps doivent utiliser la **même version de React Native**.

### Le problème rencontré

Initialement, `mobile` utilisait RN 0.82.1 (dernière version) tandis qu'Expo SDK 54 utilisait RN 0.81.5. Cela créait :
- **3 versions de react-native** dans `node_modules/.pnpm`
- Des erreurs "Invalid hook call" dues aux multiples instances de React
- Des crashes Android avec `library "libreact_featureflagsjni.so" not found`

### La solution

#### 1. Forcer une version unique avec pnpm overrides

Dans le `package.json` racine :

```json
{
  "pnpm": {
    "overrides": {
      "react-native": "0.81.5",
      "@react-native/babel-plugin-codegen": "0.81.5",
      "@react-native/babel-preset": "0.81.5",
      "@react-native/codegen": "0.81.5",
      "@react-native/js-polyfills": "0.81.5",
      "@react-native/metro-babel-transformer": "0.81.5",
      "@react-native/metro-config": "0.81.5"
    }
  }
}
```

#### 2. Aligner les versions dans chaque package.json

Dans `apps/mobile/package.json`, `apps/mobile-expo/package.json`, etc. :

```json
{
  "dependencies": {
    "react-native": "0.81.5"
  },
  "devDependencies": {
    "@react-native-community/cli": "20.0.0",
    "@react-native/babel-preset": "0.81.5",
    "@react-native/metro-config": "0.81.5",
    "@react-native/typescript-config": "0.81.5"
  }
}
```

#### 3. Régénérer le dossier Android (si créé avec une autre version)

Si le dossier `android/` a été créé avec RN 0.82, il contient des fichiers incompatibles. Solution :

```bash
cd apps/mobile
mv android android_backup
npx @react-native-community/cli init mobile --version 0.81.5 --skip-install --directory temp_mobile
mv temp_mobile/android .
rm -rf temp_mobile
```

### Commandes de nettoyage utiles

#### Vérifier les versions installées

```bash
# Voir combien de versions de react-native sont installées
ls node_modules/.pnpm | grep "^react-native@0"

# Vérifier la version dans un package
cat apps/mobile/node_modules/react-native/package.json | grep version
```

#### Nettoyage complet et réinstallation

```bash
# Supprimer le lockfile et réinstaller
rm pnpm-lock.yaml
pnpm clean && pnpm install
```

#### Nettoyage iOS

```bash
cd apps/mobile/ios
rm -rf build Pods Podfile.lock
pod install
```

#### Nettoyage Android

```bash
# Supprimer les builds et caches Gradle
rm -rf apps/mobile/android/build
rm -rf apps/mobile/android/app/build
rm -rf apps/mobile/android/.gradle
rm -rf ~/.gradle/caches

# Désinstaller l'app de l'émulateur
adb uninstall com.mobile

# Rebuilder
pnpm --filter mobile-financial-app android
```

#### Reset Metro

```bash
npx react-native start --reset-cache
```

### Debugging Android

Pour voir les logs de crash Android :

```bash
# Effacer les anciens logs
adb logcat -c

# Enregistrer les logs dans un fichier
adb logcat > /tmp/crash.log

# (Lancer l'app qui crash, puis Ctrl+C)

# Voir les erreurs
grep -A 10 "FATAL EXCEPTION" /tmp/crash.log
```

---

## Dépannage

### 🔧 Général (iOS & Android)

#### Erreur "Unable to resolve module" dans le simulateur/émulateur

Dans un monorepo pnpm, les dépendances sont hoistées à la racine. Metro doit être configuré pour les trouver.

Le fichier `apps/mobile/metro.config.js` doit inclure :

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

Après modification, redémarrer Metro (`Ctrl + C` puis `pnpm --filter mobile-financial-app start`).

---

### 🍎 iOS

#### `xcodebuild` requires Xcode

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

#### `pod: command not found` ou erreurs CocoaPods

Utiliser Bundler (installé localement dans le projet) :

```bash
cd apps/mobile
bundle install
bundle exec pod install --project-directory=ios
```

#### Erreurs Ruby / `kconv` / `securerandom`

Installer Ruby 3.1.x via rbenv (voir section 2 ci-dessus).

#### Erreur "No script URL provided" au lancement de l'app

Metro n'est pas démarré. Lancer dans un terminal séparé :

```bash
pnpm --filter mobile-financial-app start
```

Puis recharger l'app dans le simulateur (`Cmd + R`).

---

### 🤖 Android

#### Erreur "Gradle requires JVM 17 or later"

Gradle 9 nécessite Java 17 minimum. Installer et configurer Java 17 :

```bash
brew install openjdk@17
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc
source ~/.zshrc
```

Vérifier : `java -version` doit afficher `openjdk 17.x.x`.

#### Erreur "adb: command not found"

Le SDK Android n'est pas dans le PATH :

```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

#### Erreur "Included build node_modules/@react-native/gradle-plugin does not exist"

Dans un monorepo pnpm, certaines dépendances React Native ne sont pas installées par défaut. Ajouter les dépendances manquantes :

```bash
pnpm --filter mobile-financial-app add -D @react-native/gradle-plugin@0.82.1 @react-native/codegen@0.82.1
```

#### Erreur "Unable to load script" ou écran blanc

Metro n'est pas démarré ou l'app n'est pas connectée.

1. Lancer Metro dans un terminal séparé :
   ```bash
   pnpm --filter mobile-financial-app start
   ```

2. Relancer l'app :
   ```bash
   pnpm --filter mobile-financial-app android
   ```

3. Ou recharger dans l'émulateur : appuyer sur `R` deux fois.

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
pnpm --filter mobile-financial-app start

# Lancer l'app sur Android
pnpm --filter mobile-financial-app android

# Lancer l'app sur iOS
pnpm --filter mobile-financial-app ios
```

## Fonctionnement du monorepo

### pnpm workspaces

Le fichier `pnpm-workspace.yaml` déclare les packages du monorepo :

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

**Avantages :**

- **Dépendances centralisées** : pnpm installe tout dans un seul `node_modules` à la racine (avec liens symboliques).
- **Partage de code** : les packages peuvent s'importer entre eux.
- **Commandes unifiées** : on gère tout depuis la racine avec `pnpm --filter`.

### Ajouter une dépendance à un package

```bash
# Ajouter une dépendance au package "mobile"
pnpm --filter mobile-financial-app add <package-name>

# Ajouter une dépendance de dev
pnpm --filter mobile-financial-app add -D <package-name>
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
2. ~~Initialiser le projet React Native CLI dans `apps/mobile`~~ ✅
3. Ajouter un projet Expo dans `apps/mobile-expo`
4. Créer un package `shared` pour le code partagé
