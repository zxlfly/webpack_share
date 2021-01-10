const TerserPlugin = require("terser-webpack-plugin")
module.exports={
    entry:{
        'addnum':"./src/index.js",
        "addnum.min":"./src/index.js"
    },
    output:{
        filename:"[name].js",
        library:"zxl-addnum",//库名
        libraryTarget:'umd',//模式 umd有兼容性的判断处理
        libraryExport:"default",//导出module的default值，打包的js文件里面的方法就可以直接使用了
    },
    // 我们需要控制那个文件需要压缩那个不需要，所以需要关闭默认压缩。使用terser插件来控制
    mode:"none",
    // 者这里面配置
    // 默认情况下,导出的js文件里面的方法无法直接使用，它是一个module类的形式导出的，挂在default字段上
    // 需要output配置libraryExport
    optimization:{
        minimize:true,
        minimizer:[new TerserPlugin({
            test:/\.min\.js$/
        })]
    }
}