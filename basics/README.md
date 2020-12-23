# 简介
本质上是一个JavaScript的静态模块打包器。处理应用程序的时候，会递归的构建依赖关系图，其中包含应用程序需要的每个模块，最后将这些模块打包成一个或多个bundle。是⼯程化、⾃动化思想在前端开发中的体现。
# 安装
- 安装webpack之前需要安装node，推荐最新的稳定版本
- 分为全局和项目安装两种
**全局安装**
``npm install webpack webpack-cli -g``
个人不推荐全局安装，会锁定webpack的版本，如果多个项目使用的webpack版本不一致，打包的时候可能出现问题，构建失败
**项目安装(可以使用npx)**
安装最新的稳定版本``npm i -D webpack``
安装指定版本``npm i -D webpack@<version>``
安装最新的体验版本``npm i -D webpack@beta``
安装webpack V4+版本时，需要额外安装webpack-cli``npm i -D webpack-cli``
# 执行构建
**npx方式**``npm webpack``
这种会先在项目的node_modules下查找是否安装webpack，如果安装了就直接执行webpack构建，如果没有安装就会在项目中安装webpack
**npm方式**``npm run start``
需要手动去package文件配置script ``"start": "webpack"``

```
//内容唯一标识，随着内容变化而改变
Hash: 6a64045a17640724534b
//版本
Version: webpack 4.43.0
//耗时
Time: 56ms
//资源输出信息
Built at: 2020/12/21 下午11:34:22
  Asset       Size  Chunks             Chunk Names
main.js  958 bytes       0  [emitted]  main
Entrypoint main = main.js
[0] ./src/index.js 28 bytes {0} [built]

//没有设置mode，默认使用生产模式production
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

上面这种方式是没有做任何配置的，实际的开发使用中，基本不会零配置，更多的还是需要我们做而外的配置。  
在根目录下创建``webpack.config.js``即可进行配置

## 默认配置（不设置webpack默认就会这样执行）
```
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
 }
};
```

### entry 入口
- **单入口**有多种写法
  - 常见的就像默认配置那样直接是字符串
  - 还可以数组，可以多个文件打包成一个文件
  - 也可以是对象，key就是对应的打包之后的名
  - 上面的方式可以灵活组合使用
- **多入口**
  - 只能是对象形式用法和上面说的一样

### output 输出配置  
filename可以使默认那样写死的``main.js``那输出的就是这个，但是如果是多页面入口的就不可以，需要一一对应打包出来，所以这时候需要使用webpack约定好的站位符``[name].js``，会自动识别key或者文件名作为名称，单入口也适用

### mode 模式  
用来指定当前的构建环境
- **production**会压缩，为模块和chunk启用确定性的混淆名称，开启一些优化
- **development**未压缩的形式，为模块和chunk启用有效的名
- **none**不使用任何默认的优化选项

### loader 默认情况下，我们常用的文件webpack仅仅支持``.js .json``这两种，通过loader，可以让它解析其他类型的文件  
比如处理css文件需要安装``npm install --save-dev css-loader``,然后在配置文件中配置module选项

### plugin 插件 loader只要是让webpack识别更多的文件类型，而plugin是让其可以控制构建流程，从而执行一些特殊任务。webpack的功能补充，比如生成index.html关联打包之后的文件，打包的时候清楚上一次的内容

### chunk 指代码块，一个chunk可能由多个模块组合而成，也用于合并代码与分割。和入口对应

### module 模块

### bundle 资源经过webpack流程解析编译之后最终输出的文件。  
webpack打包出来的文件里面其实就是一个自执行的函数。参数是一个对象包含了入口和依赖的相关信息

**一个bundle对应一个chunk**
**一个chunk对应一个或多个module**