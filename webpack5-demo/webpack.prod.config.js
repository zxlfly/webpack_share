const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require("webpack-merge")
const baseConfig = require("./webpack.base.config")
const glob = require("glob")
const webpack = require("webpack");
const loaderPages = () => {
  const entry = {}
  const HtmlWebpackPlugins = []
  const files = glob.sync(path.posix.join(__dirname, './src/pages/*/*.js'))
  files.forEach(file => {
    const match = file.match(/src\/pages\/.*\/(.*)\.js$/)
    entry[match[1]] = path.posix.join(__dirname, match[0])
    HtmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.posix.join(__dirname, `./src/pages/${match[1]}/${match[1]}.html`),
        filename: `${match[1]}.html`,
        chunks: [match[1]]
        //引入对应的js文件，不加默认引入所有entry 里面的js文件
      })
    )
  })
  return {
    entry, HtmlWebpackPlugins
  }
}
const { entry, HtmlWebpackPlugins } = loaderPages()
const prodConfig = {
  entry,
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src/css'),
        // loader执行顺序从右到左
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // 局部拼接（图像、文件、外部资源定义公共路径）
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          "postcss-loader"
        ]
      }, {
        test: /\.less$/,
        include: path.join(__dirname, 'src/css'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // 局部拼接（图像、文件、外部资源定义公共路径）
            options: {
              publicPath: '../'
            }
          },
          "css-loader", "postcss-loader",
          "less-loader"
        ]
      }, {
        test: /\.scss$/,
        include: path.join(__dirname, 'src/css'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // 局部拼接（图像、文件、外部资源定义公共路径）
            options: {
              publicPath: '../'
            }
          },
          // "style-loader", 
          "css-loader",
          'postcss-loader',
          "sass-loader"
        ]
      }, {
        test: /\.(png|jpe?g|gif)$/,
        include: path.join(__dirname, 'src/images'),
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: path.join(__dirname, 'src/font'),
        type: "asset/resource",
        generator: {
          filename: 'font/[hash][ext][query]',
        }
      }, {
        test: /\.js$/,
        include: path.join(__dirname, 'src/pages'),
        // loader执行顺序从右到左
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true
            },
          },
          {
            loader: "replace-loader",
            options: {
              name: '同步'
            }
          },
          // {
          //     loader: "replace-loader-async",
          //     options: {
          //         name: '异步'
          //     }
          // }
        ]
      },
    ]
  },
  devtool: "source-map",
  devServer: {
    static: "./dist",
    open: true,
    port: 8081,
    // hotOnly: true,
  },
  plugins: [
    ...HtmlWebpackPlugins,
    new MiniCssExtractPlugin({
      filename: "css/[name]-[hash:6].css",
    }),
    // new TxtWebpackPlugin(),
    // new MyLogWebpackPlugin({
    //     name: 'xiu'
    // }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
module.exports = merge(baseConfig, prodConfig)