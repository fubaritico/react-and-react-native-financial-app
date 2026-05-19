---
title: Fix — Xcodebuild Errors (65 and 70)
type: note
permalink: fix-xcodebuild-errors
tags: [fix, ios, debugging, how-to]
---

# Fix — Xcodebuild Errors (65 and 70)

## Observations

- [symptom] xcodebuild error 70 — code signing not configured for physical device
- [fix-70] Use `ios:sim` for simulator (no signing needed) or set up signing in Xcode for physical device
- [symptom] xcodebuild error 65 — stale DerivedData or `ENABLE_USER_SCRIPT_SANDBOXING=YES`
- [fix-65-step-1] Set `ENABLE_USER_SCRIPT_SANDBOXING = NO` in project.pbxproj (both Debug + Release)
- [fix-65-step-2] Clean DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData`
- [fix-65-step-3] Rebuild: `npx expo prebuild --clean && npx expo run:ios`
- [symptom] Pod install fails — stale CocoaPods cache
- [fix-pods] `pod repo update && pod cache clean --all`

## Relations

- related_to [[Wireless Debugging Decision]]
- related_to [[Fix — Disk Space and Build Artifact Cleanup]]
