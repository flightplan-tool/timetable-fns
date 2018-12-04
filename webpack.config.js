const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({ title: 'Production' })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'timetable-fns.js',
    library: 'timetable-fns',
    libraryTarget: 'umd'
  },
  externals: {
    'moment-timezone': {
      commonjs: 'moment-timezone',
      commonjs2: 'moment-timezone',
      amd: 'moment-timezone',
      root: 'moment'
    }
  }
}
