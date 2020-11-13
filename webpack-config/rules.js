const path = require('path');
module.exports = projectInfo => {
    return [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: 'babel-loader?cacheDirectory',
              },
              {
                  loader: 'thread-loader',
                  options: {
                      workers: 4
                  }
              }
          ],
        }
    ];
}