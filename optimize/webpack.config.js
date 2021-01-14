const path = require("path");
const HtmlWebpackPlugin =require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MyLogWebpackPlugin =require('./myplugins/myLog-webpack-plugin.js')
const TxtWebpackPlugin = require('./myplugins/txt-webpack-plugin.js')
const glob = require("glob")
const loaderPages =()=>{
    const entry={}
    const HtmlWebpackPlugins = []
    // 设置一个路径规则会把符合规则的路径全部返回
    const files =  glob.sync(path.join(__dirname,'./src/pages/*/*.js'))
    // console.log(files);
    files.forEach(item=>{
        const match = item.match(/src\/pages\/.*\/(.*)\.js$/)
        entry[match[1]]=path.join(__dirname,match[0])
        // console.log(item.match(/src\/pages\/.*\/(.*)\.js$/));
        HtmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template:path.join(__dirname,`./src/pages/${match[1]}/${match[1]}.html`),
                filename:`pages/${match[1]}.html`,
                chunks:[match[1]]
            })
        )
    })
    return {
        entry,HtmlWebpackPlugins
    }
}
const {entry,HtmlWebpackPlugins} = loaderPages()
module.exports = {
    entry,
    output: {
        path: path.resolve(__dirname, './dist'),
        // 加上hash并且使用前6位
        filename: "js/[name]-[hash:6].js",
        // 可以给全局的资源拼接路径
        // publicPath:"../"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.css$/,
                // loader执行顺序从右到左
                include:"./src/css",
                use: [
                    'style-loader', 
                    'css-loader', 
                    "postcss-loader"
                ]
            }, {
                test: /\.less$/,
                include:"./src/css",
                use: [
                    "style-loader", 
                    "css-loader", "postcss-loader", 
                    "less-loader"
                ]
            }, {
                test: /\.scss$/,
                include:"./src/css",
                use: [
                    {
                        loader:MiniCssExtractPlugin.loader,
                        // 局部拼接（图像、文件、外部资源定义公共路径）
                        options:{
                            publicPath:'../'
                        }
                    },
                    // "style-loader", 
                    "css-loader",  
                    'postcss-loader', 
                    "sass-loader"
                ]
            },{
                test: /\.(png|jpe?g|gif)$/,
                include:"./src/images",
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
                include:"./src/font",
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
    devtool:"source-map",
    devServer: {
        contentBase: "./dist",
        open: true,
        port: 8088,
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
        ...HtmlWebpackPlugins,
        new MiniCssExtractPlugin({
            filename:"css/[name]-[hash:6].css",
        }),
        new TxtWebpackPlugin(),
        new MyLogWebpackPlugin({
            name:'xiu'
        })
    ],
}