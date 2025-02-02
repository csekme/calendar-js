const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/calendar.js',
  output: {
    filename: 'calendar.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Calendar',
    libraryTarget: 'umd',
    libraryExport: 'default', // Ez biztosítja, hogy a default export legyen a globális változó tartalma
    globalObject: 'this'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // kivonja a CSS-t egy külön fájlba
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'calendar.css' // A generált CSS fájl neve
    })
  ]
};
