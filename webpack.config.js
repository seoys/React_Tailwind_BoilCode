const path = require('path');
const webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => {
  return {
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
        chunkFilename: '[id].css'
      }),
      new HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({}),
      new HtmlWebpackPlugin({
        hash: true, // 정적 파일을 불러올때 쿼리문자열에 웹팩 해쉬값을 추가한다
        template: './src/index.html', // 템플릿 경로를 지정
        // templateParameters: { // 템플릿에 주입할 파라매터 변수 지정
        //   env: process.env.NODE_ENV === 'develop' ? '(개발용)' : '',
        // },
        minify: process.env.NODE_ENV === 'production' ? {
          collapseWhitespace: true, // 빈칸 제거
          removeComments: true, // 주석 제거
        } : false,
      }),
      
    ],
    devServer: {
      open: true,
      overlay: true,
      clientLogLevel: 'silent',
      contentBase: path.join(__dirname, "dist"),
      historyApiFallback: true,
      port: 8000,
      stats: "errors-only",
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