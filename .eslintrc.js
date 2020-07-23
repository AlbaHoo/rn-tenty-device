module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: ['import'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        alias: {
          _src: './src',
          _assets: './src/assets',
          _components: './src/components',
          _services: './src/services',
          _utils: './src/utils',
        },
      },
    },
  },
};
