var path = require('path');
var webpack = require('webpack')

module.exports =
  {
    entry: './lib/client.js',
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
        { 
          test: /\.css$/, 
          loader: "style-loader!css-loader"
        },
        {
          test: /\.(jpg|png|svg)$/,
          loader: 'url-loader'
        },
     ]
   },
   externals: {
     jquery: 'jQuery'
   }
  }
