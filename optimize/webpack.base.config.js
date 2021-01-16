const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MyLogWebpackPlugin =require('./myplugins/myLog-webpack-plugin.js')
const TxtWebpackPlugin = require('./myplugins/txt-webpack-plugin.js')
module.exports = {
    output: {
        path: path.resolve(__dirname, './dist'),
        // 加上hash并且使用前6位
        filename: "js/[name]-[hash:6].js",
        // 可以给全局的资源拼接路径
        // publicPath:"../"
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: "url-loader",
                // options额外的配置，⽐如资源名称
                options: {
                    name: "[name].[ext]",
                    //打包后的存放位置
                    outputPath: "images/",
                    // 超过3kb就不转换成base64
                    limit:1024 * 3
                }
            },{
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use:[
                    // 'thread-loader',
                    {
                        loader: "file-loader",
                        // options额外的配置，⽐如资源名称
                        options: {
                            name: "[name]-[hash:6].[ext]",
                            //打包后的存放位置
                            outputPath: "font/",
                        }
                    }
                ],
            }, 
            {
                test: /\.js$/,
                // loader执行顺序从右到左
                use: [
                    {
                        loader:"replace-loader",
                        options:{
                            name:'同步'
                        }
                    },
                    {
                        loader:"replace-loader-async",
                        options:{
                            name:'异步'
                        }
                    }
                ]
            },

        ]
    },
    resolveLoader:{
        modules:['./node_modules','./myLoader']
    },
    plugins: [
        // 打包清空dist冗余文件
        new CleanWebpackPlugin(),
        // 生成html
        new TxtWebpackPlugin(),
        new MyLogWebpackPlugin({
            name:'xiu'
        })
    ],
}