const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: /node_modules\/html5-qrcode/, // Ignore source maps for html5-qrcode
  })
);