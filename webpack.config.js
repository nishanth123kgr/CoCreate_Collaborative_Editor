const path = require('path');

module.exports = {
  experiments: { asyncWebAssembly: true },
  target: 'web',
  mode: "development", // or production
  entry: './public/js/main.js',
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'bundle.js',
  },
  performance: {       // we dont want the wasm blob to generate warnings
     hints: false,
     maxEntrypointSize: 512000,
     maxAssetSize: 512000
  }
};