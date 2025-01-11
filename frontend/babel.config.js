module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'], // Preset recomendado para Expo
      plugins: [
        'react-native-reanimated/plugin', // Necesario para react-native-reanimated
      ],
    };
  };
  