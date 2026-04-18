#!/bin/bash

# Generate changelogs only for packages with staged changes.
# Runs conventional-changelog scoped to each package directory,
# then stages the updated CHANGELOG.md files.

PACKAGES=(
  "packages/ui"
  "apps/mobile-expo"
  "apps/mobile"
  "apps/mobile-expo-ejected"
)

for pkg in "${PACKAGES[@]}"; do
  # Check if any staged files belong to this package
  if git diff --cached --name-only | grep -q "^${pkg}/"; then
    echo "Updating changelog for ${pkg}..."
    (cd "$pkg" && pnpm exec conventional-changelog -p angular -r 0 --path . > CHANGELOG.md)
    git add "${pkg}/CHANGELOG.md"
  fi
done
