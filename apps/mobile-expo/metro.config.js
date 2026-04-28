const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'packages/ui/node_modules'),
];

config.resolver.sourceExts = [
  'native.tsx', 'native.ts', 'native.jsx', 'native.js',
  ...config.resolver.sourceExts,
];

const uiSrcDir = path.resolve(monorepoRoot, 'packages/ui/src');
const uiAliases = {
  '#Lib': path.join(uiSrcDir, 'lib'),
  '#Atoms': path.join(uiSrcDir, 'components/atoms'),
  '#Molecules': path.join(uiSrcDir, 'components/molecules'),
  '#Organisms': path.join(uiSrcDir, 'components/organisms'),
  '#Templates': path.join(uiSrcDir, 'components/templates'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const [alias, target] of Object.entries(uiAliases)) {
    if (moduleName === alias || moduleName.startsWith(alias + '/')) {
      const rest = moduleName === alias ? '' : moduleName.slice(alias.length + 1);
      const resolved = rest ? path.join(target, rest) : target;
      return context.resolveRequest(context, resolved, platform);
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
