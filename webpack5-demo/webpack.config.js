const path = require("path");
const glob = require("glob")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MyLogWebpackPlugin = require('./myplugins/myLog-webpack-plugin.js')
const TxtWebpackPlugin = require('./myplugins/txt-webpack-plugin.js')
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
module.exports = {
    entry,
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
                    // {
                    //     loader: MiniCssExtractPlugin.loader,
                    //     // 局部拼接（图像、文件、外部资源定义公共路径）
                    //     options: {
                    //         publicPath: '../'
                    //     }
                    // },
                    "css-loader", "postcss-loader",
                    "less-loader"
                ]
            }, {
                test: /\.scss$/,
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
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            }, {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                type: "asset/resource",
                generator: {
                    filename: 'font/[hash][ext][query]',
                }
            }, {
                test: /\.js$/,
                // loader执行顺序从右到左
                use: [
                    {
                        loader: "babel-loader"
                    }
                    // {
                    //     loader: "replace-loader",
                    //     options: {
                    //         name: '同步'
                    //     }
                    // },
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
    resolveLoader: {
        modules: ['./node_modules', './myLoader']
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
        new CleanWebpackPlugin(),
    ],
}