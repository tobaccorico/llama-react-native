/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ttf', 'otf', 'm4v', 'mov', 'mp4'],
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
    extraNodeModules: {
      'missing-asset-registry-path': require.resolve('react-native/Libraries/Image/AssetRegistry'),
    },
  },
};
