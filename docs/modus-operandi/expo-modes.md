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

Pour tester sur un iPhone physique, il faut d'abord **builder et installer l'app
sur le téléphone** (une seule fois, via USB). Ensuite l'app dev-client sur le
téléphone se connecte à Metro via le réseau local.

### Première installation (USB obligatoire)

```bash
# iOS (nécessite Apple Developer account)
pnpm expo:ios:device

# Android
pnpm expo:android:device
```

Xcode propose la liste des devices connectés — choisir le téléphone physique.
L'app est compilée et installée directement sur le device.

### Relancer Metro après l'installation

```bash
pnpm expo:start --dev-client
```

L'app dev-client sur le téléphone affiche un écran d'accueil avec :
- La liste des serveurs Metro détectés sur le réseau local
- Un scanner QR pour se connecter manuellement

Scanner le QR code **depuis l'app dev-client** (pas depuis Expo Go).

### Prérequis device physique

- Apple Developer account (gratuit suffit pour le dev local)
- Device enregistré dans Xcode (Window → Devices and Simulators)
- iPhone et Mac sur le **même Wi-Fi**
- Première installation via USB — ensuite Metro se connecte en Wi-Fi

## Simulateur + device physique en parallèle

Le simulateur et le device physique peuvent tourner en même temps. Les deux se
connectent au même serveur Metro — pas de conflit.

Mais l'app dev-client doit être installée sur chaque cible séparément :
- Simulateur : via `pnpm expo:ios:iphone` (automatique)
- Device physique : via `pnpm expo:ios:device` (USB, une seule fois)

---

## Troubleshooting — du plus simple au plus extrême

Les problèmes sont classés par gravité. **Toujours essayer la solution la plus
légère d'abord** avant de passer à la suivante.

### Niveau 1 — Problèmes simples (pas de rebuild)

#### L'app ne charge pas / écran blanc

**Causes** : Metro ne tourne pas, mauvais port, cache Metro.

**Solutions (dans l'ordre)** :
1. Vérifier que Metro tourne dans un terminal
2. Shake le device → "Reload" (ou `r` dans le terminal Metro)
3. Relancer Metro avec cache propre :
   ```bash
   pnpm expo:start:clean
   ```

#### Port 8081 occupé

**Symptôme** : `A dev server is already running on port 8081`

```bash
lsof -ti:8081 | xargs kill -9
```

Puis relancer Metro.

#### "Could not connect to server"

**Cause** : iPhone et Mac pas sur le même Wi-Fi, ou firewall.

**Solutions** :
1. Vérifier le Wi-Fi (même réseau)
2. Désactiver le firewall Mac temporairement (Réglages → Réseau → Firewall)
3. Fallback tunnel : `npx expo start --tunnel` (nécessite `@expo/ngrok`)

#### Hot reload ne marche plus

**Cause** : Metro a perdu la connexion.

**Solutions** :
1. `r` dans le terminal Metro (force reload)
2. Ctrl+C → relancer Metro
3. Fermer et rouvrir l'app sur le simulateur/device

---

### Niveau 2 — Problèmes de build natif (rebuild partiel)

#### "Cannot find native module 'Xxx'"

**Cause** : JS mis à jour (nouveau package natif) mais le binary est ancien.

```bash
pnpm expo:rebuild:ios
```

#### Erreur de compilation Xcode après ajout d'un package

**Cause** : Pods pas à jour, DerivedData périmé.

**Solutions (dans l'ordre)** :
1. Rebuild simple :
   ```bash
   pnpm expo:rebuild:ios
   ```
2. Si ça persiste — nettoyer DerivedData :
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   pnpm expo:rebuild:ios
   ```

#### Erreur Gradle / Android build

```bash
pnpm expo:rebuild:android
```

Le script `rebuild-android.sh` stoppe le daemon Gradle, nettoie les caches,
fait un `prebuild --clean`, et rebuild.

---

### Niveau 3 — Le simulateur déconne

#### Simulateur lent / freeze / comportement bizarre

**Solutions (dans l'ordre)** :
1. Fermer le simulateur (Cmd+Q) et le rouvrir
2. Device → Erase All Content and Settings (dans le menu du simulateur)
3. Reset complet des simulateurs :
   ```bash
   xcrun simctl erase all
   ```
   **Attention** : ça efface les réglages (langue, clavier). Remettre le français :
   Settings → Général → Langue et région → Français
   Settings → Général → Clavier → Claviers → Ajouter → Français

#### Simulateur disparu / plus de devices dans la liste

**Cause** : Runtime iOS supprimé (cleanup Xcode, mise à jour Xcode, outil tiers).

**Fix** : Xcode → Settings (Cmd+,) → Components → cliquer "Get" sur iOS 18.x.
Les devices par défaut (iPhone 16 Pro, etc.) sont recréés automatiquement.

---

### Niveau 4 — Tout est cassé (reset complet)

#### L'app crash au démarrage, rien ne marche

```bash
# 1. Kill tout
# Ctrl+C sur Metro, Cmd+Q sur le simulateur

# 2. Nettoyage natif + DerivedData
rm -rf apps/mobile-expo/ios apps/mobile-expo/android
rm -rf ~/Library/Developer/Xcode/DerivedData

# 3. Rebuild from scratch
pnpm expo:rebuild:ios
```

#### Même le rebuild échoue

```bash
# 1. Kill tout
# Ctrl+C sur Metro, Cmd+Q sur le simulateur

# 2. Reset complet (node_modules + caches + natif)
pnpm reset

# 3. Rebuild
pnpm expo:rebuild:ios
```

`pnpm reset` fait : supprime tous les node_modules, caches Metro, Watchman,
DerivedData, prune le pnpm store, et reinstalle tout.

#### Même le reset échoue

```bash
# Niveau nucléaire — tout supprimer manuellement

# 1. Kill tout
killall node 2>/dev/null
killall Simulator 2>/dev/null

# 2. Supprimer caches Xcode
rm -rf ~/Library/Developer/Xcode/DerivedData

# 3. Supprimer caches CocoaPods
pod cache clean --all

# 4. Supprimer natif
rm -rf apps/mobile-expo/ios apps/mobile-expo/android

# 5. Supprimer tous les node_modules
find . -name node_modules -type d -prune -exec rm -rf {} +

# 6. Supprimer le cache pnpm
pnpm store prune

# 7. Réinstaller
pnpm install --frozen-lockfile

# 8. Rebuild
pnpm expo:rebuild:ios
```

#### Les simulateurs sont complètement perdus (plus de runtime iOS)

1. Ouvrir Xcode → Settings (Cmd+,) → Components
2. Cliquer "Get" sur le runtime iOS voulu (ex: iOS 18.4)
3. Attendre le téléchargement (plusieurs Go)
4. Les devices par défaut se recréent automatiquement
5. Puis `pnpm expo:rebuild:ios`

---

## PIÈGE CRITIQUE : ne jamais appuyer sur "s" dans Metro

Quand Metro tourne en mode dev-client, le terminal affiche une option `s` pour
"switch to Expo Go". **NE JAMAIS APPUYER SUR "s".**

Ce qui se passe si on le fait :
1. Metro bascule en mode Expo Go
2. Le QR code affiché est un QR Expo Go
3. Si on le scanne avec un iPhone → ça ouvre Expo Go (pas l'app dev-client)
4. Expo Go ne peut pas charger les modules natifs custom → crash
5. Le simulateur perd aussi la connexion → tout est cassé

**Recovery** : voir Niveau 4 ci-dessus.

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

Ne jamais mélanger les deux modes. Si tu veux le QR code (Expo Go) → pas de
dossier natif. Si tu veux le simulateur ou device physique → il faut un build
dev-client. Le QR code se scanne depuis **l'app dev-client**, jamais depuis
Expo Go quand les dossiers natifs existent.
