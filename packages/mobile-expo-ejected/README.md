# mobile-expo-ejected

Application React Native avec **Expo (bare workflow)** — projet "ejecté" via `expo prebuild`.

## Stack

- **Expo SDK 54**
- **React Native 0.81.5**
- **TypeScript**
- **Code natif exposé** (ios/ et android/)

## Commands

All commands are run from the **monorepo root**.

### Dev (Expo Go — JS only)

Use these for quick iteration on JS code. Runs via Expo Go — no native build required, but no custom icon, splash screen, or native modules.

```bash
# Start Metro bundler
pnpm --filter mobile-expo-ejected start

# Launch on iOS via Expo Go
pnpm --filter mobile-expo-ejected ios

# Launch on Android via Expo Go
pnpm --filter mobile-expo-ejected android
```

### Build (native binary — full app experience)

Use these when you need the real app: custom icon, splash screen, native modules, or testing on a physical device. Compiles a native binary via Xcode/Gradle using the existing `ios/` and `android/` folders.

```bash
# Build and run on iOS simulator
pnpm --filter mobile-expo-ejected ios:build

# Build and run on physical iPhone (prompts for device selection)
pnpm --filter mobile-expo-ejected ios:build:device

# Build and run on Android emulator
pnpm --filter mobile-expo-ejected android:build

# Build and run on physical Android device
pnpm --filter mobile-expo-ejected android:build:device
```

## Différence avec mobile-expo (managed)

| Aspect | mobile-expo (managed) | mobile-expo-ejected (bare) |
|--------|----------------------|---------------------------|
| Dossiers ios/android | ❌ Cachés | ✅ Exposés |
| Modules natifs custom | ❌ Limité | ✅ Possible |
| Expo Go | ✅ Oui | ❌ Non (build natif requis) |
| Complexité | Simple | Plus complexe |
| Expo SDK | ✅ Disponible | ✅ Disponible |

## Différence avec mobile (React Native CLI pur)

| Aspect | mobile (RN CLI) | mobile-expo-ejected |
|--------|-----------------|---------------------|
| Expo SDK | ❌ Non | ✅ Oui |
| Config via app.json | ❌ Non | ✅ Oui |
| Régénérable | ❌ Non | ✅ `npx expo prebuild` |
| Setup initial | Manuel | Automatisé |

## Régénérer le code natif

Si tu modifies `app.json` (nom, icône, permissions...), tu peux régénérer :

```bash
npx expo prebuild --clean
```

⚠️ Cela écrase les modifications manuelles dans `ios/` et `android/`.

## Structure

```
mobile-expo-ejected/
├── App.tsx          # Point d'entrée
├── app.json         # Configuration Expo
├── ios/             # Projet Xcode natif
├── android/         # Projet Gradle natif
├── assets/
├── package.json
└── tsconfig.json
```

## Quand utiliser ce workflow ?

- Tu as besoin de **modules natifs custom**
- Tu veux **modifier le code natif** iOS/Android
- Tu veux garder les **avantages d'Expo** (SDK, config centralisée)
