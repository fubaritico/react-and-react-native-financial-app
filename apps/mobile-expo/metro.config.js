/**
 * Metro bundler configuration for the Expo managed app (mobile-expo).
 *
 * Key concerns in a pnpm monorepo:
 * 1. Watch folders — Metro must see the entire monorepo, not just this app
 * 2. Module resolution — node_modules from app, root, and workspace packages
 * 3. Source extensions — .native.tsx/.ts/.jsx/.js resolved before platform-neutral files
 * 4. UI package aliases — #Atoms, #Molecules, etc. mapped to packages/ui/src/
 * 5. Singleton enforcement — prevent duplicate React Context instances across packages
 */
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// --- Watch folders ---
// Metro only watches the app dir by default. In a monorepo, workspace packages
// (ui, shared, features, etc.) live outside the app — Metro needs to see them.
config.watchFolders = [monorepoRoot];

// --- Module resolution paths ---
// Order matters: app-local first, then monorepo root, then ui package internals.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'packages/ui/node_modules'),
];

// --- Source extensions ---
// Prioritize .native.* files so platform-specific implementations are picked
// over shared types files (e.g. Button.native.tsx over Button.tsx).
config.resolver.sourceExts = [
  'native.tsx', 'native.ts', 'native.jsx', 'native.js',
  ...config.resolver.sourceExts,
];

// --- SVG transformer ---
// Route .svg files through react-native-svg-transformer so they can be
// imported as React Native components (using react-native-svg under the hood).
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer/expo'
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// --- Asset extensions ---
// Add .lottie to asset extensions so Metro bundles it as a binary asset.
config.resolver.assetExts = [...config.resolver.assetExts, 'lottie'];

// --- UI package aliases ---
// The @financial-app/ui package uses tsconfig path aliases (#Atoms, #Lib, etc.)
// that tsc understands but Metro doesn't. We resolve them manually here.
const uiSrcDir = path.resolve(monorepoRoot, 'packages/ui/src');
const uiAliases = {
  '#Lib': path.join(uiSrcDir, 'lib'),
  '#Atoms': path.join(uiSrcDir, 'components/atoms'),
  '#Molecules': path.join(uiSrcDir, 'components/molecules'),
  '#Organisms': path.join(uiSrcDir, 'components/organisms'),
  '#Templates': path.join(uiSrcDir, 'components/templates'),
};

// --- Singleton enforcement ---
// pnpm creates separate copies of a package when its peer dependency contexts
// differ. For example, react-i18next has react-dom as an optional peer dep.
// If the app resolves react-dom@19.2.5 but features resolves react-dom@19.1.0,
// pnpm installs two copies of react-i18next — each with its own React Context.
// The app initializes i18n on copy A, but features calls useTranslation() on
// copy B (uninitialised) → translation keys returned raw instead of translated.
// Fix: force all imports to resolve to the app's single copy.
const singletons = {
  'react-i18next': path.dirname(require.resolve('react-i18next/package.json')),
  'i18next': path.dirname(require.resolve('i18next/package.json')),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // UI package aliases (#Atoms, #Lib, etc.)
  for (const [alias, target] of Object.entries(uiAliases)) {
    if (moduleName === alias || moduleName.startsWith(alias + '/')) {
      const rest = moduleName === alias ? '' : moduleName.slice(alias.length + 1);
      const resolved = rest ? path.join(target, rest) : target;
      return context.resolveRequest(context, resolved, platform);
    }
  }

  // Singleton resolution — redirect workspace packages to app's copy
  for (const [pkg, pkgPath] of Object.entries(singletons)) {
    if (moduleName === pkg) {
      return context.resolveRequest(context, pkgPath, platform);
    }
    if (moduleName.startsWith(pkg + '/')) {
      const rest = moduleName.slice(pkg.length + 1);
      return context.resolveRequest(context, path.join(pkgPath, rest), platform);
    }
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
