const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Polyfill Node.js modules that React Native doesn't have
config.resolver.extraNodeModules = {
  crypto: require.resolve('expo-crypto'),
  stream: require.resolve('readable-stream'),
  buffer: require.resolve('buffer'),
  url: require.resolve('url'),
  events: require.resolve('events'),
  util: require.resolve('util'),
  assert: require.resolve('assert'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  http2: require.resolve('stream-http'),
  os: require.resolve('os-browserify/browser'),
  path: require.resolve('path-browserify'),
  zlib: require.resolve('browserify-zlib'),
};

module.exports = config;
