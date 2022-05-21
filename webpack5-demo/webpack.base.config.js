const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  output: {
    path: path.resolve(__dirname, './dist'),
    // 加上hash并且使用前6位
    filename: "js/[name]-[hash:6].js",
    // 可以给全局的资源拼接路径
    // publicPath:"../"
    // 可以在这配置
    //assetModuleFilename: 'images/[hash][ext][query]'
  },
  mode: "development",
  module: {
    rules: [
      {
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
        ]
      },
    ]
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/images/"),
    },
    extensions: ['.js', '.scss'],
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, './node_modules'), path.resolve(__dirname, './myLoader')]
  },
  devServer: {
    static: "./dist",
    open: true,
    port: 8081,
    // hotOnly: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
}