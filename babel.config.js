module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Keep other plugins here if you add them later. The Reanimated plugin must be last.
      'react-native-reanimated/plugin',
    ],
  };
};
