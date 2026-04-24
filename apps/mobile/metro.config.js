const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(projectRoot);

// Force singleton resolution — pnpm creates separate virtual store entries when
// peer dep contexts differ (e.g. @babel/core versions). Without this, Metro may
// resolve a JS copy that doesn't match the linked native binary, causing crashes.
const singletonPkgs = ['react-native-svg'];
const appNodeModules = path.resolve(projectRoot, 'node_modules');

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      appNodeModules,
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    sourceExts: [
      'native.tsx', 'native.ts', 'native.jsx', 'native.js',
      ...defaultConfig.resolver.sourceExts,
    ],
    resolveRequest: (context, moduleName, platform) => {
      if (singletonPkgs.includes(moduleName)) {
        return context.resolveRequest(
          { ...context, originModulePath: path.resolve(projectRoot, 'package.json') },
          moduleName,
          platform,
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
