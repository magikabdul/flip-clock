const path = require("path");
const outputDir = path.resolve(__dirname, "dist/js/");
module.exports = {
  devtool: "eval-source-map",
  entry: path.resolve(__dirname, "src/js/scripts.js"),
  mode: "production",
  output: {
    path: outputDir,
    filename: "scripts.js"
  }
};
