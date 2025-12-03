# mobile-expo

Application React Native avec **Expo (managed workflow)**.

## Stack

- **Expo SDK 54**
- **React Native 0.81.5**
- **TypeScript**

## Commandes

```bash
# Démarrer le serveur de développement
pnpm --filter mobile-expo start

# Lancer sur iOS (simulateur)
pnpm --filter mobile-expo ios

# Lancer sur Android (émulateur)
pnpm --filter mobile-expo android

# Lancer sur Web
pnpm --filter mobile-expo web
```

## Expo Go (test sur device physique)

1. Installer l'app **Expo Go** sur ton téléphone
2. Lancer `pnpm --filter mobile-expo start`
3. Scanner le QR code affiché dans le terminal

## Avantages du managed workflow

- ✅ Pas de configuration native (pas de Xcode/Android Studio requis pour dev)
- ✅ OTA updates possibles
- ✅ SDK Expo riche (camera, notifications, auth...)
- ✅ Build cloud avec EAS

## Limitations

- ❌ Pas d'accès direct au code natif iOS/Android
- ❌ Modules natifs custom limités
- ❌ Dépendance à l'écosystème Expo

## Structure

```
mobile-expo/
├── App.tsx          # Point d'entrée
├── app.json         # Configuration Expo
├── assets/          # Images, fonts...
├── package.json
└── tsconfig.json
```
