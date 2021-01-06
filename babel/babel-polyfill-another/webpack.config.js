const path = require("path");
const HtmlWebpackPlugin =require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: {
        index: "./src/index.js"
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        // 加上hash并且使用前6位
        filename: "[name]-[hash:6].js",
        // 可以给全局的资源拼接路径
        // publicPath:"../"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader"
            },
        ]
    },
    plugins: [
        // // 生成html
        new HtmlWebpackPlugin({
            template:"./src/index.html",
            filename:"index.html",
        }),
        // 打包清空dist冗余文件
        new CleanWebpackPlugin(),
    ],
}