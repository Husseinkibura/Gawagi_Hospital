const webpack = require("webpack");

module.exports = {
  resolve: {
    fallback: {
      fs: false, // Disable fs polyfill
      path: require.resolve("path-browserify"), // Polyfill for path
      child_process: false, // Disable child_process polyfill
      util: require.resolve("util"), // Polyfill for util
      buffer: require.resolve("buffer"), // Polyfill for buffer
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser", // Polyfill for process
    }),
  ],
};