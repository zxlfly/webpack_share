const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("css-minimizer-webpack-plugin");
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const { merge } = require("webpack-merge")
const baseConfig = require("./webpack.base.config")
const glob = require("glob")
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
        //引入对应的js文件，不加默认引入所有entry 里面的js文件
        chunks: [match[1]],
        minify: {
          removeComments: true, // 移除HTML中的注释
          collapseWhitespace: true, // 删除空⽩符与换⾏符
          minifyCSS: true // 压缩内联css
        }
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
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src/css'),
        // loader执行顺序从右到左
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
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

          },
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
  devtool: "cheap-module-source-map",
  optimization: {
    usedExports: true, // 哪些导出的模块被使⽤了，再做打包
    //作⽤域提升（Scope Hoisting）
    concatenateModules: true,
    sideEffects: false,
    //帮我们⾃动做代码分割
    splitChunks: {
      chunks: "all",//默认是⽀持异步，我们使⽤all
    },
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        // 引擎默认也是 cssnano
        // 移除所有注释
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      new TerserPlugin({
        extractComments: false,
        //parallel: true // 多线程
        terserOptions: {
          // format: {
          // },
          output: {
            // 是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
            comments: false,
            beautify: false,
          },
          compress: {
            // 删除⽆⽤的代码
            unused: true,
            // 删掉 debugger
            drop_debugger: true, // eslint-disable-line
            // 移除 console
            drop_console: true, // eslint-disable-line
            // 移除⽆⽤的代码
            dead_code: true, // eslint-disable-line
          }
        }
      })
    ]
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

    // 清除⽆⽤ css
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true })
    }),
    // new webpack.HotModuleReplacementPlugin(),
  ],
}
module.exports = merge(baseConfig, prodConfig)