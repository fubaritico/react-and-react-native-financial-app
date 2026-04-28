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

const uiSrcDir = path.resolve(monorepoRoot, 'packages/ui/src');
const uiAliases = {
  '#Lib': path.join(uiSrcDir, 'lib'),
  '#Atoms': path.join(uiSrcDir, 'components/atoms'),
  '#Molecules': path.join(uiSrcDir, 'components/molecules'),
  '#Organisms': path.join(uiSrcDir, 'components/organisms'),
  '#Templates': path.join(uiSrcDir, 'components/templates'),
};

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
      // Handle #Alias imports from ui package
      for (const [alias, target] of Object.entries(uiAliases)) {
        if (moduleName === alias || moduleName.startsWith(alias + '/')) {
          const rest = moduleName === alias ? '' : moduleName.slice(alias.length + 1);
          const resolved = rest ? path.join(target, rest) : target;
          return context.resolveRequest(context, resolved, platform);
        }
      }
      // Singleton resolution — ensures one instance of peer-dep-sensitive packages
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
