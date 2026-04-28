# Expo — Modes de lancement

## Les 2 modes

| Mode | C'est quoi | Quand l'utiliser |
|------|-----------|-----------------|
| **Expo Go** | App viewer universelle (App Store) | Dev rapide, QR code, pas de module natif custom |
| **Dev Build** | Build natif installé sur simulateur/device | Simulateur, device physique, modules natifs custom |

## Comment Expo choisit le mode

Si `ios/` ou `android/` existent dans le projet → **dev-client** automatiquement.
Sinon → **Expo Go**.

C'est tout.

## QR code sur iPhone (Expo Go)

```bash
# 1. Vérifier qu'il n'y a pas de dossiers natifs
ls apps/mobile-expo/ios    # ne doit pas exister

# 2. Si ils existent, les supprimer
rm -rf apps/mobile-expo/ios apps/mobile-expo/android

# 3. Lancer
pnpm expo:start

# 4. Scanner le QR code avec l'appareil photo
#    → ouvre Expo Go → charge l'app
```

Prérequis :
- Expo Go installé depuis l'App Store
- iPhone et Mac sur le même Wi-Fi
- Pas de dossier `ios/` ni `android/` dans le projet

## Simulateur (Dev Build)

```bash
# iPhone
pnpm expo:ios:iphone

# iPad
pnpm expo:ios:ipad

# Android
pnpm expo:android
```

Ces commandes font `prebuild` + `build` + `install` sur le simulateur.
Ensuite Metro démarre automatiquement.

Pour relancer Metro seul (sans rebuild) :
```bash
pnpm expo:start --dev-client
```

## Device physique (Dev Build)

```bash
# iOS (nécessite Apple Developer account)
pnpm expo:ios:device

# Android
pnpm expo:android:device
```

Puis relancer Metro :
```bash
pnpm expo:start --dev-client
```

## Pannes courantes

| Symptôme | Cause | Fix |
|----------|-------|-----|
| "is no longer available" (QR) | `ios/` existe → mode dev-client | `rm -rf ios android` |
| QR ouvre Expo Go mais crash | Version Expo Go incompatible avec le SDK | Mettre à jour Expo Go (App Store) |
| "Could not connect to server" | Pas le même Wi-Fi | Vérifier Wi-Fi, ou `npx expo start --tunnel` |
| Port 8081 occupé | Metro zombie | `lsof -ti:8081 \| xargs kill -9` |
| "Cannot find native module" | JS mis à jour mais pas le binary | `npx expo prebuild --clean && npx expo run:ios` |
| Metro tourne mais rien ne charge | Cache Metro corrompu | `pnpm expo:start:clean` |

## Passer d'un mode à l'autre

### Expo Go → Simulateur
```bash
cd apps/mobile-expo
npx expo prebuild --clean    # crée ios/ et android/
npx expo run:ios             # build + install sur simulateur
```

### Simulateur → Expo Go
```bash
rm -rf apps/mobile-expo/ios apps/mobile-expo/android
pnpm expo:start              # retour en mode Expo Go
```

## Règle d'or

Ne jamais mélanger les deux modes. Si tu veux le QR code → pas de dossier natif. Si tu veux le simulateur → il te faut un build.
