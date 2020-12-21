const path = require("path");
module.exports = {
    // 必填 webpack执⾏构建⼊⼝
    //既支持相对路径也支持绝对路径
    entry: "./src/index.js",
    output: {
        // 将所有依赖的模块合并输出到main.js
        //只支持绝对路径
        filename: "main.js",
        // 输出⽂件的存放路径，必须是绝对路径
        path: path.resolve(__dirname, "./dist")
    },
    // 开发模式（不会压缩代码）
    mode:'development'
};