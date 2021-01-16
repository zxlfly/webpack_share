const path = require("path");
const HtmlWebpackPlugin =require('html-webpack-plugin');
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
                chunks:[match[1]]
            })
        )
    })
    return {
        entry,HtmlWebpackPlugins
    }
}
const {entry,HtmlWebpackPlugins} = loaderPages()
const devConfig = {
    entry,
    mode: "development",
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
                    "style-loader", 
                    "css-loader",  
                    'postcss-loader', 
                    "sass-loader"
                ]
            } 
        ]
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
        // 生成html
        ...HtmlWebpackPlugins,
    ],
}
module.exports = merge(baseConfig,devConfig)