class TxtWebpackPlugin {
    constructor(options) {
        // console.log(options);
    }
    apply(compiler) {
        //hooks.emit 定义在某个时刻
        compiler.hooks.emit.tapAsync(
            "TxtWebpackPlugin",
            (compilation, cb) => {
                compilation.assets["test.txt"] = {
                    source: function () {
                        return "hello copy";
                    },
                    size: function () {
                        return 20;
                    }
                };
                cb();
            }
        );

        //同步的写法
        //compiler.hooks.compile.tap("TxtWebpackPlugin", compilation => {
        // console.log("开始了");
        //});
    }
}
module.exports = TxtWebpackPlugin;