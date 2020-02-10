const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: false,
    port: 9000,
    host: '0.0.0.0' // allow everyone on localhost to see the server
  }
};
