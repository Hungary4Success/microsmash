const CopyPlugin = require("copy-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = {
  entry: "./src/scripts/main.js",
  mode: "development",
  target: "web",
  performance: { hints: false },
  output: {
    path: `${__dirname}/dist`,
    filename: "game.js"
  },
  plugins: [
    new CopyPlugin([
      { from: "src/main.css", to: "main.css" },
      { from: "src/index.html", to: "index.html" }
    ]),
    new FileManagerPlugin({
      onStart: { delete: ["./dist"] }
    })
  ]
};
