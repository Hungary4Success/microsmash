const CopyPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  mode: 'production',
  // Disable bundle size warning
  performance: { hints: false },
  output: {
    path: `${__dirname}/dist`,
    filename: 'game.js'
  },
  plugins: [
    // Generate a static html page for the game
    new HtmlWebpackPlugin({
      title: 'Ultimate Super Micro Smash Bit 5',
      template: './src/index.html',
      filename: 'index.html',
      inlineSource: '.(js|css)$'
    }),
    // Inline sources to avoid the need for a webserver
    new HtmlWebpackInlineSourcePlugin(),
    // Copy included assets over to the build directory
    new CopyPlugin([
      { from: 'src/main.css', to: 'main.css' }
    ]),
    // JS bundling cannot be disabled, so delete bundle after build
    new FileManagerPlugin({
      onStart: { delete: ['./dist'] },
      onEnd: { delete: ['./dist/game.js'] }
    })
  ]
};
