const path = require("path");
const HtmlWebpackPlugin =require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require("webpack");
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
                test: /\.css$/,
                // loader执行顺序从右到左
                use: [
                    'style-loader', 
                    'css-loader', 
                    "postcss-loader"
                ]
            }, {
                test: /\.less$/,
                use: [
                    "style-loader", 
                    "css-loader", 
                    "postcss-loader", 
                    "less-loader"
                ]
            }, {
                test: /\.scss$/,
                use: [
                    // {
                    //     loader:MiniCssExtractPlugin.loader,
                    //     // 局部拼接（图像、文件、外部资源定义公共路径）
                    //     options:{
                    //         publicPath:'../'
                    //     }
                    // },
                    "style-loader", 
                    "css-loader",  
                    'postcss-loader', 
                    "sass-loader"
                ]
            },{
                test: /\.(png|jpe?g|gif)$/,
                loader: "url-loader",
                // options额外的配置，⽐如资源名称
                options: {
                    name: "[name]-[hash:6].[ext]",
                    //打包后的存放位置
                    outputPath: "images/",
                    // 超过3kb就不转换成base64
                    limit:1024 * 3
                }
            },{
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: "file-loader",
                // options额外的配置，⽐如资源名称
                options: {
                    name: "[name]-[hash:6].[ext]",
                    //打包后的存放位置
                    outputPath: "font/",
                }
            }, 
            {
                test: /\.js$/,
                // loader执行顺序从右到左
                use: [
                    // {
                    //     loader:"replace-loader",
                    //     options:{
                    //         name:'同步'
                    //     }
                    // },
                    // {
                    //     loader:"replace-loader-async",
                    //     options:{
                    //         name:'异步'
                    //     }
                    // },
                    {
                        loader: "babel-loader",
                        options: {
                          presets: [[
                            '@babel/preset-env',
                            {
                                // 目标浏览器
                                // targets:{

                                // },
                                corejs:2,
                                useBuiltIns:"usage"
                                // entry: 需要在 webpack 的⼊⼝⽂件⾥ import "@babel/polyfill" ⼀次。 babel 会根据你的使⽤情况导⼊垫⽚，没有使⽤的功能不会被导⼊相应的垫⽚。
                                // usage: 不需要import ，全⾃动检测，但是要安装 @babel/polyfill 。（试验阶段）
                                // false: 如果你 import"@babel/polyfill" ，它不会排除掉没有使⽤的垫⽚，程序体积会庞⼤。(不推荐)
                            }
                          ]]
                        }
                    }
                ]
            },

        ]
    },
    resolveLoader:{
        modules:['./node_modules','./myLoader']
    },
    devtool:"source-map",
    devServer: {
        contentBase: "./dist",
        open: true,
        port: 8088,
        hot:true,
        //即便HMR不⽣效，浏览器也不⾃动刷新，就开启hotOnly
        hotOnly:true,
        proxy: {
          "/api": {
            target: "http://localhost:9092/",
          },
        },
      },
    plugins: [
        // 打包清空dist冗余文件
        new CleanWebpackPlugin(),
        // 生成html
        new HtmlWebpackPlugin({
            template:"./src/index.html",
            filename:"index.html",
        }),
        new MiniCssExtractPlugin({
            filename:"css/[name]-[hash:6].css",
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
}