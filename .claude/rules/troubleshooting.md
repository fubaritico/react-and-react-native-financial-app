# Rules — Troubleshooting

## Reset & Build Issues

Full modus operandi: `docs/modus-operandi/reset.md`

### Quick Reference

| Error | Cause | Fix |
|-------|-------|-----|
| xcodebuild error 70 | Code signing not configured for physical device | Use `ios:sim` or set up signing in Xcode |
| xcodebuild error 65 | Stale DerivedData or ENABLE_USER_SCRIPT_SANDBOXING=YES | See `iphone-wireless-deploy.md` |
| "Waiting to reconnect" | USB connection dropping during build | Use wireless debugging (see `iphone-wireless-deploy.md`) |
| Port 8081 in use | Leftover Metro process | `lsof -ti:8081 \| xargs kill -9` |
| Pod install fails | Stale CocoaPods cache | `pod repo update && pod cache clean --all` |

### Bare RN CLI (packages/mobile) — Physical Device

Full guide: `docs/modus-operandi/iphone-wireless-deploy.md`

Physical device deployment uses **wireless debugging** (Connect via Network) to avoid
USB disconnect issues during heavy xcodebuild I/O (iPhone 12 mini).

Key requirements:
- Developer Mode enabled on iPhone
- "Connect via network" checked in Xcode → Devices and Simulators
- `ENABLE_USER_SCRIPT_SANDBOXING = NO` in project.pbxproj (both Debug + Release)
- Mac and iPhone on same Wi-Fi
- Device Conditions set to None (no network simulation active)

### Simulator Management

- Close simulator between app switches (Metro port conflict)
- Only one Metro bundler at a time
- Use `ios:sim` for bare RN CLI to avoid targeting physical devices
