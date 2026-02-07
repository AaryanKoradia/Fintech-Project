// Polyfill for React Native environment
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Process polyfill
global.process = require('process');
global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';

// Add btoa/atob polyfills if needed
if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return Buffer.from(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return Buffer.from(b64Encoded, 'base64').toString('binary');
  };
}
