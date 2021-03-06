## 一些基础的配置
**.npmrc**可以配置当前项目npm的源  
### css处理
css压缩兼容抽离成独立文件等  
安装对应的loader，配置到module下的rules中。  
[postcss](https://github.com/postcss/postcss)可以编译还没有被浏览器广泛支持的css语法，内联图片，以及其他优秀的功能.需要一个``postcss.config.js``配置文件.  
css增强需要配置**Browserslist**声明一段浏览器的集合，工具会针对性的输出兼容代码。是一个帮助我们设置目标浏览器的工具，被广泛的应用到babel、postcss-presetenv、autoprefixer(兼容性问题)、cssnano(css压缩)等开发工具上。可以**配置**到``package.json``中，也可以单独放在配置文件``.browserslistrc``中。所有的工具都会主动查找该配置文件，根据配置转出对应的目标浏览器集合。**关于兼容性的数据来源于caniuse.com**
**在package.json中配置**  
```
{
    "browserslist":["last 2 version","> 1%","maintained node versions","not ir < 11"]
}
```
**在项目根目录下创建配置文件**
```
# 注释是这样写的，以＃号开头
# 每一个浏览器集合描述
last 2 version 意思是最新的两个大版本
> 1% 意识是全球超过1%人使用的浏览器，即份额。后面还可以加上地域in US表示在美国
cover99.5% 表示覆盖99.5%的主流浏览器
maintained none versions
chrom > 50 指定浏览器版本
not ie < 11  排除对应的版本
dead 全球使用率地域.5%且官方声明不在维护或者事实上已经两年没有更新版本的浏览器
not ir < 11
defaults 默认配置 ``> 0.5%`` ``last 2 versions`` ``Firefox ESR`` ``not dead``
```
**可以使用Browserslist的cli工具判断我们配置是否符合我们预期**

**常用来处理css的loader**
- css-loader 分析css模块之间的关系，并合成⼀个css（处理 import / require（） @import / url 引入的内容。）
- style-loader 会把css-loader⽣成的内容，以style挂载到⻚⾯的heade部分
- less-loader | scss-loader把less | scss语法转换成css
- postcss-loader
  - 需要在根目录下新建配置文件postcss.config.js
  - 可以配置很多插件
    - autoprefixer增强
    - cssnano压缩
- mini-css-extract-plugin将CSS提取为独立的文件
  - style-loader就不能使用了
  - 替换成mini-css-extract-plugin提供的loader
  - 如果有图片等资源需要处理使用file-loader

## 自定义loader
自定义loader为一个非箭头函数，写法参考myLoader文件夹下的loader。  
引用自定义loader可以使用``resolveLoader``设置路径，就可以和npm安装的第三方的loader一样的用法直接写名字即可

## 图片和第三方字体的处理
原理是把打包⼊⼝中识别出的资源模块，移动到输出⽬录，并且返回⼀个地址名称  
如果有图片等资源需要处理使用**file-loader**,或者使用它的增强版**url-loader**，配置方法参数一样。  
**url-loader**默认会将图片转换成base64的格式，优点是减少请求次数，缺点是增大打包之后的体积。对于小的icon图标可以开启，使用**limit**进行配置

## 关于文件名输出hash的问题
用法``[name]-[hash:6]``名称后面接上即可，数字代表截取前多少位，因为hash很长  
- 分三种**hash**、**chunkhash**、**contenthash**  
- **hash**是影响整个工程环境  
- **chunkhash**只是影响一个chunk下的模块  
- **contenthash**只根据自身的内容是否发生改变而改变

## source-map
打包文件和源文件的映射，在webpack的配置文件中添加``devtool:"source-map"``即可（具体配置参数请查看文档）。
主要是为了开发时快速定位问题，线上代码也可以开启前端错误监控，快速定位问题。

## webpack-dev-server(浏览器会刷新)
解决每次改完代码都需要重新打包的问题，相当于热更新  
需要在``package.json``script下新增``"server": "webpack-dev-server"``  
在``webpack.config.js``下配置``devServer``。具体配置项请查看文档
```
devServer: {
 contentBase: "./dist",//内容文件目录
 open: true,//是否自动打开浏览器
 port: 8080,//指定端口
 proxy: {//代理
  "/api": {
    target: "http://localhost:9092"
  }
 }
},
```

## Hot Module Replacement (HMR:热模块替换，浏览器不会刷新)
css模块HMR、js模块HMR  
不支持抽离出的css，需要使用style-loader 
devServer配置中开启hot
**css使用方法**
注意启动HMR后，css抽离会不⽣效，还有不⽀持contenthash，chunkhash
``const webpack = require("webpack");``
``new webpack.HotModuleReplacementPlugin()``
**js使用方法**
默认会刷新，需要开启``hotOnly:true``，一般开发项目会使用对应框架的HMR loader，本示例中只是简单的原理实现
``const webpack = require("webpack");``
``new webpack.HotModuleReplacementPlugin()``
入口js中开启监听

## babel（[中文文档](https://www.babeljs.cn/)）
**babel文件夹下有其他实现方式**
js的编译器，可以将es6+的代码转换成目标版本的代码。在执行编译的过程中，会从项目根目录下的**.babelrc**json文件中读取配置。没有该文件会从loader的options地方读取配置。
**安装**
``npm i babel-loader @babel/core @babel/preset-env -D``
**babel-loader**是webpack与babel通信桥梁，实际编译是@babel/preset-env来做。@babel/preset-env⾥包含了es，6，7，8转es5的转换规则。  
preset目前所支持的所有类型（语法转换）
- @babel/preset-env
- @babel/preset-flow
- @babel/preset-react
- @babel/preset-typescript
到这里除了新特性以外的都处理好了，但是新特性没有处理。需要第三方包含es6+新特性的js库来处理。  
但是如果直接引用会导致打包体积过大，需要配置成按需加载。
``npm install --save @babel/polyfill``(内置对象、实例方法转换)
安装之后可以在入口直接引入，但是这样是全部引入，体积过大，不推荐使用。
配置**presets**的时候可以配置按需加载
```
import "core-js/stable";
import "regenerator-runtime/runtime";
```
也可以将这些配置抽离到单独的配置文件``.babelrc``
**targets**目标浏览器版本，也可以使用``.browserslistrc``  
**corejs**corejs的版本  
**useBuiltIns**控制``preset``使用何种方式帮我们导入polyfill的核心，有三种参数
- entry: 需要在 webpack 的⼊⼝⽂件⾥ import "@babel/polyfill" ⼀次。 babel 会根据你的使⽤情况导⼊垫⽚，没有使⽤的功能不会被导⼊相应的垫⽚。
- usage: 不需要import ，全⾃动检测，但是要安装 @babel/polyfill 。（试验阶段）
- false: 如果你 import"@babel/polyfill" ，它不会排除掉没有使⽤的垫⽚，程序体积会庞⼤。(不推荐)