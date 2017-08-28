var path = require('path');
var webpack = require('webpack')

module.exports =
  {
    entry: './client/client.js',
    output: {
      filename: 'build.js',
      path: path.resolve(__dirname, 'client/build'),
    },
    node: {
      fs: 'empty'
    },
    module: {
     rules: [
       { 
         test: /\.handlebars$/, 
         loader: "handlebars-loader",
         query: {
          knownHelpersOnly: false
          },
        },
     ]
   },
   externals: {
     jquery: 'jQuery'
   }
  }
