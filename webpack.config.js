var path = require('path');
var webpack = require('webpack');
var firebaseConfig = require('./firebase.json');

var isProdBuild = process.argv.indexOf('-p') !== -1;

var envPlugin = new webpack.DefinePlugin({
  __DEBUG__: JSON.stringify(!isProdBuild),
  __RELEASE__: JSON.stringify(isProdBuild),
  'process.env.NODE_ENV': isProdBuild ? '"production"' : '"development"',
  __FIREBASE_URL__: '"https://' + firebaseConfig.firebase + '.firebaseio.com"'
});

module.exports = {
  mode: isProdBuild ? 'production' : 'development',
  entry: {
    app: './src/index.js',
    tests: './src/tests.js'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'app/assets/js'),
    pathinfo: true,
    publicPath: '/assets/js/' // Required for webpack-dev-server
  },
  resolve: {
    extensions: ['.js', '.jsx', '.raw.less']
  },
  node: {
    fs: 'empty'
  },
  externals: {
    ga: 'ga' // Google Analytics
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: /node_modules[\\\/]topscore-api-js[\\\/]/
      },
      { test: /\.raw\.less$/, loaders: ['raw-loader', 'less-loader'] }
    ]
  },
  plugins: [envPlugin],
  devtool: 'inline-source-map',
  devServer: {
    proxy: {
      '/**/': {
        target: 'http://localhost:8888/index.html',
        ignorePath: true,
        bypass: function(req, res, proxyOptions) {
          if (req.path.match(/\./)) {
            return req.path;
          } else if (req.path === '/tests/') {
            return '/tests/index.html';
          } else {
            return false;
          }
        }
      }
    }
  }
};
