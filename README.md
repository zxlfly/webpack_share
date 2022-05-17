# webpack
## webpack5-demo
基于webpack5的多页面应用demo
## Plugin
Webpack Plugin构成了Webpack的骨架(Skeleton)。
### Loaders
Loaders是一个string->string的函数，是对源代码的处理。同时也是插件。

# basics
webpack基础

# custom
自定义工程从零到一

# multiple
自定义多页应用工程

# babel
**babel是一个工具链，工具集，通过各种插件将代码转换为向后兼容的 JavaScript 语法。**  
在**custom**中有一个示例使用的``@babel/polyfill``默认配置，但是官方现在不推荐了，在**babel**中有其他实现方式
- @babel/runtime + @babel/runtime-corejs3 + @babel/plugin-transform-runtime
- @babel/polyfill + core-js@3  
**babel**在转译的过程中，对syntax的处理可能会使用到helper函数，对api的处理会引入polyfill。  
默认情况下，在每个需要使用的地方都会定义一个helper，导致会有大量重复的helper；引入polyfill的时候会直接修改全局变量和原型，造成污染。  
**@babel/plugin-transform-runtime**可以将他们两者都改为一个统一的地方引入（沙盒环境），且不会污染全局。  

# react-app
自定义一个react开发环境

# webpack基本流程
- 准备阶段：主要创建``Compiler``和``Compilation``对象
  - ``Compiler``：代表完整的配置环境。启动的时候被一次性建立，并配置好所有可操作性的设置，包括options，loader和plugin。插件将会接受到此对象的引用来访问配置环境。调用它的run方法可以开始一次完整的编译过程。
    - 常用的钩子
    - run：AsyncSeriesHook类型，在编译器开始读取记录之前执行
    - compile：SyncHook类型，在一次新的compilation创建之前执行
    - compilation：SyncHook类型，再一次compilation创建之后执行
    - make：AsyncSeriesHook类型，完成一次编译之前执行
    - emit：AsyncSeriesHook类型，在生成文件到output目录之前执行，回调参数：``Compilation``
    - afterEmit：AsyncSeriesHook类型，再生成文件到output目录之后执行
    - assetEmitted：AsyncSeriesHook类型，在生成文件的时候执行，提供访问产出文件信息的入口，回调函数参数：file   info
    - done：AsyncSeriesHook类型，一次编译完成之后执行，回电参数：stats
  - ``Compilation``：代表了一次资源版本构建产物。代表当前的模块资源、编译生成资源、变化的文件、以及被跟踪的依赖的状态信息。插件注册的事件会接受它作为参数。如果多个插件协同工作需要注意配置的顺序。
- 编译阶段：完成modules解析，并生成chunks
- module解析：创建实例、loaders应用和依赖收集
- chunks生成：找到每个chunk所需要的modules
- 产出阶段：根据chunks生成最终的文件
  - 模板hash更新、模板渲染chunk、生成文件   

# custom/myLoader
自定义loader

# multiple/myplugins
自定义plugin  
webpack在编译的过程中，会触发一系列tapable钩子事件，插件就是找到对应的钩子，往上面挂任务，这样在构建的时候，插件注册的事件就能随着钩子的触发而执行了。  
plugin是一个类，包含一个apply函数，接受一个参数compiler。注册的事件接受Compilation。 

# webpack打包bundle原理
bundle文件就是一个自执行的函数，参数是一个对象，入口模块为key，value就是一个函数有两个参数module和exports，内部为对应被处理过后的代码（被eval执行解析）。  
自执行的函数部分通过modules形参接受参数  
### 实现一个简版webpack
- 接受一份配置（webpack.config.js）
- 分析出入口模块位置
  - 读取入口模块的内容，解析内容
    - 区分源码和依赖
    - 递归调用处理依赖
- 拿到对象形式的数据结构
  - 模块路径
  - 处理好的内容
- 创建bundle.js
  - 启动器函数，来补充代码里有可能出现的的module exports require，让浏览器能够顺利的执⾏

# 公共库library(发布npm包)
``output.library``来指定库名  
``output.libraryTarget``指定打包规范
```
// var config
{
 output: {
 library: 'myLib',
 filename: 'var.js',
 libraryTarget: 'var'
 }
}
// output
var myLib = (function(modules) {})({
 './src/index.js': function(module, exports) {}
});
// ===============================================
// assign config
{
 output: {
 library: 'myLib',
 filename: 'assign.js',
 libraryTarget: 'assign'
 }
}
// output： 少了个 var
myLib = (function(modules) {})({
 './src/index.js': function(module, exports) {}
});
// ===============================================
// this config
{
 output: {
 library: 'myLib',
 filename: 'this.js',
 libraryTarget: 'this'
 }
}
// output
this["myLib"] = (function(modules) {})({
 './src/index.js': function(module, exports) {}
});
// ===============================================
// window config
{
 output: {
 library: 'myLib',
 filename: 'window.js',
 libraryTarget: 'window'
 }
}
// output
window["myLib"] = (function(modules) {})({
 './src/index.js': function(module, exports) {}
});
// ===============================================
// global config
{
 output: {
 library: 'myLib',
 filename: 'global.js',
 libraryTarget: 'global'
 }
}
// output：注意 target=node 的时候才是 global，默认 target=web下global 为 window
window["myLib"] = (function(modules) {})({
 './src/index.js': function(module, exports) {}
});
// ===============================================
// commonjs config
{
 output: {
 library: 'myLib',
 filename: 'commonjs.js',
 libraryTarget: 'commonjs'
 }
}
// output
exports["myLib"] = (function(modules) {})({
   './src/index.js': function(module, exports) {}
});
// ===============================================
// amd config
{
 output: {
 library: 'myLib',
 filename: 'amd.js',
 libraryTarget: 'amd'
 }
}
// output
define('myLib', [], function() {
 return (function(modules) {})({
 './src/index.js': function(module, exports) {}
 });
});
// ===============================================
// umd config
{
 output: {
 library: 'myLib',
 filename: 'umd.js',
 libraryTarget: 'umd'
 }
}
// output
(function webpackUniversalModuleDefinition(root, factory) {
 if (typeof exports === 'object' && typeof module === 'object')
module.exports = factory();
 else if (typeof define === 'function' && define.amd) define([], factory);
 else if (typeof exports === 'object') exports['myLib'] = factory();
 else root['myLib'] = factory();
})(window, function() {
 return (function(modules) {})({
 './src/index.js': function(module, exports) {}
 });
});
// ===============================================
// commonjs2 config
{
 output: {
 library: 'myLib',
 filename: 'commonjs2.js',
 libraryTarget: 'commonjs2'
 }
}
// output
module.exports = (function(modules) {})({
 './src/index.js': function(module, exports) {}
});
// ===============================================
// umd2 config
{
 output: {
 library: 'myLib',
 filename: 'umd2.js',
 libraryTarget: 'umd2'
 }
}
// output
(function webpackUniversalModuleDefinition(root, factory) {
 if (typeof exports === 'object' && typeof module === 'object')
module.exports = factory();
 else if (typeof define === 'function' && define.amd) define([], factory);
 else if (typeof exports === 'object') exports['myLib'] = factory();
 else root['myLib'] = factory();
})(window, function() {
 return (function(modules) {})({
 './src/index.js': function(module, exports) {
 }
 });
});
// ===============================================
// commonjs-module config
{
 output: {
 library: 'myLib',
 filename: 'commonjs-module.js',
 libraryTarget: 'commonjs-module'
 }
}
// ===============================================
// output
module.exports = (function(modules) {})({
 './src/index.js': function(module, exports) {}
});
// ===============================================
// jsonp config
{
 output: {
 library: 'myLib',
 filename: 'jsonp.js',
 libraryTarget: 'jsonp'
 }
}
// output
myLib((function(modules) {})({
 './src/index.js': function(module, exports) {}
}));
```
libraryTarget=global 的时候，如果 target=node 才是 global，默认target=web
下 global 为 window，保险起⻅可以使⽤ this

# 性能优化
示例复用了mutiple的demo，可以对两者进行对比  
优化开发体验和输出质量

### 性能数据收集工具分析
- chrome dev Tools
  - 我们经常使用 Chrome Dev Tools 来开发调试，还可以利用它来分析页面性能
- Lighthouse：一个开源的自动化工具，可以安装为Chrome的扩展插件，也可以命令行直接运行，可以针对目标页面进行一连串的测试，然后输出一个有关页面的性能评分报告
- 第三方收费方案（贵）
  - NewRelic
  - 阿里云ARMS
- 还可以自研相关监控系统。。。

#### LightHouse使用方式
可以使用Chrome扩展插件，这里介绍[Node Cli](https://github.com/GoogleChrome/lighthouse#using-the-node-cli)
```
//安装 npm install -g lighthouse 
//生成报告 并在浏览器中打开 
lighthouse http://baidu.com --view 
//报告格式是json，保存在当前目录 
lighthouse http://baidu.com --output=json --output-path=./report.json 
//设置浏览器的窗口尺寸 
//lighthouse http://baidu.com --chrome-flags="--window-size=1190,660" 
//模拟器设为桌面 
//lighthouse http://baidu.com --emulated-form-factor=desktop
```
性能报告
- Perfermance 性能分析
- Accessibility 可访问性
- Best Practices 最佳实践
- SEO 搜索引擎优化
- Progressive Web App 是否集成pwa

# webpack5
新版本变化
## [资源模块类型（asset module type）](https://webpack.docschina.org/guides/asset-modules/)
通过添加 4 种新的模块类型，来替换所有这些 loader：
- ``asset/resource`` 发送一个单独的文件并导出 URL。之前通过使用 ``file-loader`` 实现。
- ``asset/inline`` 导出一个资源的 data URI。之前通过使用 ``url-loader`` 实现。
- ``asset/source`` 导出资源的源代码。之前通过使用 raw-loader 实现。
- ``asset`` 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 ``url-loader``，并且配置资源体积限制实现。


## module federation
使JavaScript应用得以在客户端或服务器上动态运行另一个 bundle的代码。而这个功能在一个叫ModuleFederationPlugin 插件实现的。  
多个独立的构建可以形成一个应用程序。这些独立的构建不会相互依赖，因此可以单独开发和部署它们。
这通常被称为微前端，但并不仅限于此。
### Remote 提供模块共享服务
被其他应用所使用的应用
### Host 获取共享的模块
引用了其他应用的应用
```
new ModuleFederationPlugin({
  name: "app1",
  remotes: {
    app2: "app2@[app2Url]/remoteEntry.js",
  },
  shared: {react: {singleton: true}, "react-dom": {singleton: true}},
}),
const RemoteApp = React.lazy(() => import("app2/App"));

new ModuleFederationPlugin({
  name: 'app2',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
}),
```
配置属性：
- ``name``，必须，唯一 ID，作为输出的模块名，使用的时通过 ``${name}/${expose}`` 的方式使用；
- ``library``，必须，其中这里的 name 为作为 umd 的 name；
- ``remotes``，可选，表示作为 Host 时，去消费哪些 Remote；
- ``exposes``，可选，表示作为 Remote 时，export 哪些属性被消费；
- ``shared``，可选，优先用 Host 的依赖，如果 Host 没有，再用自己的；