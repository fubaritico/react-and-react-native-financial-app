# Modus Operandi — Wireless iPhone Deployment (bare RN CLI)

This guide covers deploying `packages/mobile` (bare React Native CLI) to a physical iPhone over Wi-Fi. This avoids USB disconnect issues during heavy xcodebuild I/O (known problem with iPhone 12 mini).

## Prerequisites

### One-Time Setup

#### 1. iPhone — Enable Developer Mode

1. Connect iPhone to Mac via USB
2. Open Xcode → **Window → Devices and Simulators** — your iPhone should appear
3. On iPhone: **Settings → Privacy & Security → Developer Mode** → toggle ON
4. iPhone will restart — confirm the prompt after reboot

#### 2. iPhone — Trust Your Mac

1. With iPhone connected via USB, tap **Trust** on "Trust This Computer?" dialog
2. If no dialog appears: **Settings → General → Transfer or Reset iPhone → Reset → Reset Location & Privacy** — then unplug/replug

#### 3. Xcode — Code Signing

1. Open `packages/mobile/ios/mobile.xcworkspace` in Xcode
2. Click the blue **mobile** project icon (top of left sidebar)
3. Under **TARGETS**, click **mobile**
4. Go to **Signing & Capabilities** tab
5. Check **Automatically manage signing**
6. Set **Team** to your Apple ID (Personal Team — free Apple ID works)
7. Set **Bundle Identifier** to `com.<yourname>.mobile`

#### 4. Xcode — Enable Wireless Debugging (Connect via Network)

1. iPhone connected via USB
2. Xcode → **Window → Devices and Simulators**
3. Select your iPhone in the left sidebar
4. Check **Connect via network** checkbox
5. Wait for a globe icon to appear next to your device — this confirms Wi-Fi pairing
6. If no globe: unplug USB, wait 5s, replug — the globe should appear when USB is disconnected

**Requirements**: Mac and iPhone must be on the same Wi-Fi network.

#### 5. Xcode — Remove Device Conditions

1. In **Window → Devices and Simulators**, select your iPhone
2. Check **Device Conditions** section — ensure **Condition** is set to **None**
3. If any condition is active (e.g. "100% packet loss"), click **Stop** and set to **None**

A network condition will silently prevent wireless debugging from working.

#### 6. iPhone — Trust Developer Certificate (after first install)

After the first successful build + install, the app won't launch — you'll see "Untrusted Developer".

1. **Settings → General → VPN & Device Management**
2. Tap your developer certificate ("Apple Development: your@email")
3. Tap **Trust**
4. Confirm

This only needs to be done once per developer certificate.

#### 7. Xcode Project — Disable Script Sandboxing

`ENABLE_USER_SCRIPT_SANDBOXING` must be `NO` in `project.pbxproj` (both Debug and Release configs). Without this, React Native's `react-native-xcode.sh` build phase cannot write `ip.txt` to the app bundle — the file that tells the app which IP to connect to for Metro.

`project.pbxproj` is NOT a generated file — it persists across `pod install`, `pnpm install`, and `pnpm reset`. Changes here are permanent unless you re-run `react-native init` or use an upgrade tool.

This is already set in the repo. If it reverts (e.g. after a React Native upgrade), fix it:

```
# In packages/mobile/ios/mobile.xcodeproj/project.pbxproj
# Change (in both Debug and Release build settings):
ENABLE_USER_SCRIPT_SANDBOXING = YES;
# To:
ENABLE_USER_SCRIPT_SANDBOXING = NO;
```

## Deploy to iPhone (Wireless)

### Step 1 — Verify wireless pairing is active

- Unplug USB cable
- Open Xcode → **Window → Devices and Simulators**
- Your iPhone should show a globe icon (network connected)
- If no globe: plug USB briefly, wait for pairing, then unplug

### Step 2 — Close Xcode

Close Xcode to avoid DerivedData lock conflicts with the CLI build.

### Step 3 — Build and deploy

```bash
pnpm --filter mobile ios
```

This runs `react-native run-ios`, which:
1. Detects the wirelessly connected iPhone
2. Compiles via `xcodebuild`
3. Installs the app over Wi-Fi
4. Launches the app
5. Writes `ip.txt` with your Mac's IP so the app connects to Metro

### Step 4 — Metro connects over Wi-Fi

The app will briefly show "Connecting to Metro..." then load the JS bundle from your Mac. Hot reloading works over Wi-Fi.

## Development Workflow (after first deploy)

Once the app is running on iPhone and Metro is running on your Mac, **hot reload is automatic**:

1. Edit any `.ts` / `.tsx` file (app code, design-system components, shared utils)
2. Metro detects the change via its file watcher
3. The app hot-reloads on the iPhone over Wi-Fi — no rebuild needed

Changes appear in ~1 second. You do NOT need to re-run `pnpm --filter mobile ios`.

### When a full rebuild IS required

A rebuild (`pnpm --filter mobile ios`) is needed only when the **native binary** must change:

| Change | Why rebuild is needed |
|--------|----------------------|
| Add/remove a native package (e.g. `react-native-maps`, `react-native-reanimated`) | New native code must be compiled into the binary |
| Run `pod install` or edit `Podfile` | CocoaPods links native libraries into the Xcode project |
| Edit native source files (`*.swift`, `*.m`, `*.mm`, `*.h` in `ios/`) | Native code is compiled ahead of time, not served by Metro |
| Change `project.pbxproj` settings (signing, build phases, capabilities) | Xcode project configuration is baked into the build |
| Change `Info.plist` (permissions, app transport security, URL schemes) | Plist is bundled into the app binary at build time |
| Upgrade React Native version | New native runtime must be compiled |

**Rule of thumb**: if the change is pure JS/TS, Metro handles it. If it touches anything under `ios/`, `android/`, or native dependencies — rebuild.

## Troubleshooting

### No globe icon in Devices and Simulators

- Mac and iPhone must be on the **same Wi-Fi network**
- Plug in USB, wait for device to appear, check "Connect via network", then unplug
- Restart Xcode if the globe doesn't appear after 30s
- Check **Device Conditions** — any active condition (especially network simulation) blocks pairing

### Build succeeds but app doesn't launch

- First install: trust the developer certificate (see step 6 above)
- Subsequent runs: the app should auto-launch after install

### Sandbox error writing ip.txt (exit code 65)

```
Sandbox: bash deny(1) file-write-create .../mobile.app/ip.txt
```

Fix: set `ENABLE_USER_SCRIPT_SANDBOXING = NO` in `project.pbxproj` (see step 7 above).

### App launches but shows white screen / doesn't connect to Metro

- Ensure Metro is running: `pnpm --filter mobile start`
- Mac and iPhone on same Wi-Fi
- Check Mac firewall isn't blocking port 8081
- Shake iPhone → Dev Menu → "Change Bundle Location" → enter Mac's IP + `:8081`

### DerivedData conflicts after switching between simulator and device

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/mobile-*
```

Then rebuild.

## Summary of Required Settings

| Setting | Location | Value |
|---------|----------|-------|
| Developer Mode | iPhone → Settings → Privacy & Security | ON |
| Connect via network | Xcode → Devices and Simulators | Checked |
| Device Conditions | Xcode → Devices and Simulators | None |
| Automatic signing | Xcode → mobile target → Signing | Enabled |
| Team | Xcode → mobile target → Signing | Your Apple ID |
| Bundle ID | Xcode → mobile target → Signing | com.yourname.mobile |
| ENABLE_USER_SCRIPT_SANDBOXING | project.pbxproj (Debug + Release) | NO |
| Trust developer | iPhone → Settings → General → VPN & Device Management | Trusted |
| Same Wi-Fi | Mac + iPhone | Required |
