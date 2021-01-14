class MyLogWebpackPlugin {
    constructor(options) {
        // console.log(options);
    }
    apply(compiler) {
        //hooks.emit 定义在某个时刻
        compiler.hooks.emit.tapAsync(
            "MyLogWebpackPlugin",
            (compilation, cb) => {
                var list = Object.keys(compilation.assets)
                compilation.assets["fileList.txt"] = {
                    source: function () {
                        return `fileNum:${list.length}---------fileNames:${list}
                        `;
                    },
                    size: function () {
                        return 20;
                    }
                };
                cb();
            }
        );

        //同步的写法
        //compiler.hooks.compile.tap("MyLogWebpackPlugin", compilation => {
        // console.log("开始了");
        //});
    }
}
module.exports = MyLogWebpackPlugin;