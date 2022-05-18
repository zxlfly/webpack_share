const { ModuleFederationPlugin } = require('webpack').container
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: "development",
  devServer: {
    port: 8081
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new ModuleFederationPlugin({
      // 当前应用的别名，唯一，被其他应用引入时的模块名称
      name: "app1",
      // 导出的文件名称，被其他应用引用的文件名称
      filename: "",
      // 作为容器的角色，配置使用的远程应用
      remotes: {
        // 属性名：映射别名，在容器中使用的应用名称
        //属性值：远程加载引用的路径（应用的name@服务器地址/远程应用的filename）
        demo: "app2@http://localhost:8082/remoteEntry.js"
      },
      // 作为远程应用，提供分享出去的内容
      exposes: {

      },
      // 共享依赖,远程应用打包不会打包这里面的内容，需要容器应用提供
      shared: []
    })
  ]
}