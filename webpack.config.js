const CopyPlugin = require("copy-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/scripts/main.js",
  mode: "production",
  // Disable bundle size warning
  performance: { hints: false },
  output: {
    path: `${__dirname}/dist`,
    filename: "game.js"
  },
  plugins: [
    // Generate a static html page for the game
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      inlineSource: ".(js|css)$"
    }),
    // Inline sources to avoid the need for a webserver
    new HtmlWebpackInlineSourcePlugin(),
    new CopyPlugin([
      { from: "src/styles/main.css", to: "styles/main.css" },
      { from: "src/styles/roboto.css", to: "styles/roboto.css" }
    ]),
    // JS bundling cannot be disabled, so delete bundle after build
    new FileManagerPlugin({
      onStart: { delete: ["./dist"] },
      onEnd: { delete: ["./dist/game.js"] }
    })
  ]
};
