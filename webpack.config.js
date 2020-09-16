const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { HotModuleReplacementPlugin } = require('webpack')

module.exports = (env, argv) => {
  return {
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
        chunkFilename: '[id].css'
      }),
      new HotModuleReplacementPlugin(),
    ],
    devServer: {
      open: true,
      clientLogLevel: 'silent',
      contentBase: './dist',
      historyApiFallback: true,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  "targets": {
                    "node": "12"
                  }
                }],
                '@babel/preset-react'
              ]
            }
          }]
        },
        {
          test: /\.css$/i,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [
            'style-loader',
            {
              loader: MiniCssExtractPlugin.loader,
              options: { 
                hmr: argv.mode === 'development' 
              }
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ]
        },
      ]
    },
  }
}