const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  mode: 'production',
  output: {
    path: `${__dirname}/dist`,
    filename: 'game.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Ultimate Super Micro Smash Bit 5',
      template: './src/template.html',
      filename: 'index.html',
      inlineSource: '.(js|css)$'
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new CopyPlugin([
      { from: 'src/main.css', to: 'main.css' }
    ])
  ]
};
