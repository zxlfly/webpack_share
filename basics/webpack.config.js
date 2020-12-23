const path = require("path");
const HtmlWebpackPlugin =require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    // 必填 webpack执⾏构建⼊⼝
    //既支持相对路径也支持绝对路径
    entry: "./src/index.js",
    // 多页面形式
    // entry:{
    //     main:"./src/index.js",
    //     about:'./src/about.js'
    // }
    output: {
        // 将所有依赖的模块合并输出到main.js
        //只支持绝对路径
        filename: "main.js",
        // 输出⽂件的存放路径，必须是绝对路径
        path: path.resolve(__dirname, "./dist")
    },
    // 开发模式（不会压缩代码）
    mode:'development',
    module:{
        rules:[
            {
                test:/\.css$/,
                // loader执行顺序从右到左
                use: [ 'style-loader','css-loader' ]
            }
        ]
    },
    plugins:[
        // 生成html
        new HtmlWebpackPlugin({
            template:"./src/index.html",
            filename:"index.html",
            minify
        }),
        // 打包清空dist冗余文件
        new CleanWebpackPlugin()
    ]
    // 多页面就写多个
    // chunks写入当前页面需要关联的文件，对应入口
    // plugins:[
    //     new HtmlWebpackPlugin({
    //         template:"./src/index.html",
    //         filename:"index.html",
    //         chunks:['main','list']
    //     }),
    //     new HtmlWebpackPlugin({
    //         template:"./src/about.html",
    //         filename:"about.html",
    //         chunks:['main','about']
    //     })
    // ]
};