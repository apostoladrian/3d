const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = {
  entry: './src/js/index.js',
  mode: "development",
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      { from: './threejs/three.js/build/three.min.js', to: 'three.js' },
      { from: './threejs/Physijs/physi.js', to: 'physi.js' },
      { from: './threejs/Physijs/physijs_worker.js', to: 'physijs_worker.js' },
      { from: './threejs/Physijs/ammo.js', to: 'ammo.js' },
      { from: './src/stats.min.js', to: 'stats.js' },
      { from: './threejs/three.js/examples/js/libs/inflate.min.js', to: 'inflate.js' },
      { from: './src/js/external_objects', to: 'external_objects' }
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  module: {
    rules: [{
      exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
      loader: require.resolve('file-loader'),
      options: {
        name: 'static/media/[name].[hash:8].[ext]',
      }
    }]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: {
    THREE: 'THREE'
  }
};

// https://github.com/josdirksen/learning-threejs