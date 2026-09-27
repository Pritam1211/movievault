module.exports = {
  preset: '@react-native/jest-preset',
  // Several RN-ecosystem packages ship untranspiled ESM. Jest skips node_modules
  // by default, so anything imported from here must be listed or it fails with
  // "Cannot use import statement outside a module".
  transformIgnorePatterns: [
    'node_modules/(?!(?:@react-native|react-native|react-native-url-polyfill|react-native-mmkv|@supabase)/)',
  ],
};
