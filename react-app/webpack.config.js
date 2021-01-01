const path = require("path");
const HtmlWebpackPlugin =require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports={
    entry:"./src/index.js",
    output:{
        filename:"[name].js",
        path: path.resolve(__dirname, "./dist")
    },
    mode:"development",
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:"babel-loader"
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:"./src/index.html",
            filename:"index.html",
        }),
        new CleanWebpackPlugin(),
    ]
}