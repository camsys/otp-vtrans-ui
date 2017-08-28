var path = require('path');
var webpack = require('webpack')

module.exports =
  {
    entry: './lib/index.js',
    output: {
      filename: 'build.js',
      path: path.resolve(__dirname, 'client/build'),
      library: "OTP"
      //libraryTarget: "commonjs2"
    },
    node: {
      fs: 'empty'
    },
    module: {
     rules: [
       {
         test: /\.html$/,
         use: [ "html-loader" ]
       },
       { 
         test: /\.handlebars$/, 
         loader: "handlebars-loader",
         query: {
          knownHelpersOnly: false
          },
        },
      
      
     ]
   },
  }

/*
{
  test: /\.css$/,
  use: [ 'style-loader', 'css-loader' ]
},
{
  test: /\.(woff*|svg|ttf)$/,
  loader: 'url-loader',
}
*/