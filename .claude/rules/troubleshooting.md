# Rules — Troubleshooting

## Reset & Build Issues

Full modus operandi: `docs/modus-operandi/reset.md`

### Quick Reference

| Error | Cause | Fix |
|-------|-------|-----|
| xcodebuild error 70 | Code signing not configured for physical device | Use `ios:sim` or set up signing in Xcode |
| xcodebuild error 65 | Stale DerivedData / sandbox conflict | `rm -rf ~/Library/Developer/Xcode/DerivedData/mobile-*` |
| "Waiting to reconnect" | USB connection dropping during build | Replug, reset Location & Privacy, or use simulator |
| Port 8081 in use | Leftover Metro process | `lsof -ti:8081 \| xargs kill -9` |
| Pod install fails | Stale CocoaPods cache | `pod repo update && pod cache clean --all` |

### Bare RN CLI (packages/mobile) — Physical Device

Physical device deployment requires Xcode code signing setup (free Apple ID is sufficient).
Known issue: iPhone 12 mini USB connection drops during heavy xcodebuild I/O.
Workaround: use simulator (`ios:sim`) or test via Expo Go with mobile-expo.

### Simulator Management

- Close simulator between app switches (Metro port conflict)
- Only one Metro bundler at a time
- Use `ios:sim` for bare RN CLI to avoid targeting physical devices
