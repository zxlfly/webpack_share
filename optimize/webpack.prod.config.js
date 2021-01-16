const path = require("path");
const HtmlWebpackPlugin =require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {merge} = require("webpack-merge")
const baseConfig = require("./webpack.base.config")
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
                chunks:[match[1]],
                minify:{
                    removeComments:true,
                    collapseWhitespace:true,
                    minifyCSS:true
                }
            })
        )
    })
    return {
        entry,HtmlWebpackPlugins
    }
}
const {entry,HtmlWebpackPlugins} = loaderPages()
const prodConfig = {
    entry,
    mode: "production",
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                include:path.join(__dirname,'src/css'),
                // loader执行顺序从右到左
                use: [
                    'style-loader', 
                    'css-loader', 
                    "postcss-loader"
                ]
            }, {
                test: /\.less$/,
                include:path.join(__dirname,'src/css'),
                use: [
                    "style-loader", 
                    "css-loader", "postcss-loader", 
                    "less-loader"
                ]
            }, {
                test: /\.scss$/,
                include:path.join(__dirname,'src/css'),
                use: [
                    {
                        loader:MiniCssExtractPlugin.loader,
                        // 局部拼接（图像、文件、外部资源定义公共路径）
                        options:{
                            publicPath:'../'
                        }
                    },
                    "css-loader",  
                    'postcss-loader', 
                    "sass-loader"
                ]
            }
        ]
    },
    // devtool:"source-map",
    plugins: [
        // 生成html
        ...HtmlWebpackPlugins,
        new MiniCssExtractPlugin({
            filename:"css/[name]-[hash:6].css",
        }),
    ],
}
module.exports = merge(baseConfig,prodConfig)