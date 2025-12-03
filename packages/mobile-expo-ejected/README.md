# mobile-expo-ejected

Application React Native avec **Expo (bare workflow)** — projet "ejecté" via `expo prebuild`.

## Stack

- **Expo SDK 54**
- **React Native 0.81.5**
- **TypeScript**
- **Code natif exposé** (ios/ et android/)

## Commandes

```bash
# Démarrer Metro
pnpm --filter mobile-expo-ejected start

# Lancer sur iOS (simulateur)
pnpm --filter mobile-expo-ejected ios

# Lancer sur Android (émulateur)
pnpm --filter mobile-expo-ejected android
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
