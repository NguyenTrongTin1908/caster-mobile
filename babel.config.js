module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'transform-inline-environment-variables',
    [
      'module-resolver',
      {
        root: ['./src', './lib'],
        alias: {
          assets: './src/assets',
          screens: './src/screens',
          navigations: './src/navigations',
          lib: './src/lib',
          providers: './src/providers',
          components: './src/components',
          typings: './src/typings',
          utils: './src/utils',
          services: './src/services',
          interfaces: './src/interfaces',
          socket: './src/socket',
          config: './config'
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]
};
