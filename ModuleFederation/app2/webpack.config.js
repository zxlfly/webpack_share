const { ModuleFederationPlugin } = require('webpack').container
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: "development",
  devServer: {
    port: 8082
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new ModuleFederationPlugin({
      // 当前应用的别名，唯一，被其他应用引入时的模块名称
      name: "app2",
      // 导出的文件名称，被其他应用引用的文件名称
      filename: "remoteEntry.js",
      // 作为容器的角色，配置使用的远程应用
      remotes: {

      },
      // 作为远程应用，提供分享出去的内容
      exposes: {
        "./index": "./src/index.js"
      },
      // 共享依赖,远程应用打包不会打包这里面的内容，需要容器应用提供
      shared: []
    })
  ]
}