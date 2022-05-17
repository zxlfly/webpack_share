# demo
基于webpack5实现的多页面应用demo
## 初始化
```
npm init -y # 初始化npm配置⽂件
npm install --save-dev webpack # 安装核⼼库
npm install --save-dev webpack-cli # 安装命令⾏⼯具
```
可以配置``.npmrc``设置源
## 样式处理
### 集成css样式处理：css-loader style-loader
``npm install style-loader css-loader -D``
### 集成less sass
不要使用node-sass  
``npm install sass sass-loader -D``  
``npm install less less-loader -D``
### 集成postcss
相当于babel于JS。postcss主要功能只有两个：第⼀就是把css解析成JS可以操作的抽象语法树AST，第⼆就是调⽤插
件来处理AST并得到结果；所以postcss⼀般都是通过插件来处理css，并不会直接处理。比如
- ⾃动补⻬浏览器前缀: autoprefixer
- css压缩等 cssnano

``npm install postcss postcss-loader autoprefixer cssnano -D``
```
module.exports = {
  plugins: [require("autoprefixer"), require("cssnano")],
};
```

### 经过如上⼏个loader处理，css最终是打包在js中的，运⾏时会动态插⼊head中，但是我们⼀般在⽣产环境会把css⽂件分离出来（有利于⽤户端缓存、并⾏加载及减⼩js包的⼤⼩），这时候就⽤到 ``mini-css-extract-plugin`` 插件。
``npm install mini-css-extract-plugin -D``
### [Browserslist](https://github.com/browserslist/browserslist)
browserslist 实际上就是声明了⼀段浏览器的集合，我们的⼯具可以根据这段集合描述，针对性的输出兼容性代码。Browserslist 被⼴泛的应⽤到 Babel、postcss-preset-env、autoprefixer 等开发⼯具上。  
Browserslist 的配置可以放在 package.json 中，也可以单独放在配置⽂件 .browserslistrc 中。所有的⼯具都会主动查找 browserslist 的配置⽂件，根据 browserslist 配置找出对应的⽬标浏览器集合。
#### 手动检测
``npx browserslist "last 1 version, >1%"``
####  在package.json 中的配置是增加⼀个 browserslist 数组属性
```
{
 "browserslist": ["last 2 version", "> 1%", "maintained node versions", "not ie < 11"] 
}
```
#### 或者在项⽬的根⽬录下创建⼀个 .browserslistrc ⽂件
```
# 注释是这样写的，以#号开头
# 每⾏⼀个浏览器集合描述
last 2 version
> 1%
maintained node versions
not ie < 11
```
## 图⽚/字体⽂件处理
### [资源模块类型（asset module type）](https://webpack.docschina.org/guides/asset-modules/)
通过添加 4 种新的模块类型，来替换所有这些 loader：
- ``asset/resource`` 发送一个单独的文件并导出 URL。之前通过使用 ``file-loader`` 实现。
- ``asset/inline`` 导出一个资源的 data URI。之前通过使用 ``url-loader`` 实现。
- ``asset/source`` 导出资源的源代码。之前通过使用 raw-loader 实现。
- ``asset`` 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 ``url-loader``，并且配置资源体积限制实现。
## html⻚⾯处理
htmlwebpackplugin会在打包结束后，⾃动⽣成⼀个html⽂件，并把打包⽣成的js模块引⼊到该html中。
``npm install --save-dev html-webpack-plugin``

## 清空dist
clean-webpack-plugin:如何做到dist⽬录下某个⽂件或⽬录不被清空：  
使⽤配置项:``cleanOnceBeforeBuildPatterns``  
``cleanOnceBeforeBuildPatterns: ["/*", "!dll", "!dll/"]``！感叹号相当于exclude 排除，意思是清空操作排除dll⽬录，和dll⽬录下所有⽂件。 注意：数组列表⾥的“*/”是默认值，不可忽略，否则不做清空操作。  
``npm install --save-dev clean-webpack-plugin``  

## [sourceMap](https://www.webpackjs.com/configuration/devtool/)
源代码与打包后的代码的映射关系，通过sourceMap定位到源代码。在dev模式中，默认开启，关闭的话 可以在配置⽂件⾥配置[devtool](https://webpack.js.org/configuration/devtool#devtool)：``devtool:"none"``  
- eval:速度最快,使⽤eval包裹模块代码,
- source-map： 产⽣ .map ⽂件
- cheap:较快，不包含列信息
- Module：第三⽅模块，包含loader的sourcemap（⽐如jsx to js ，babel的sourcemap）
- inline： 将 .map 作为DataURI嵌⼊，不单独⽣成 .map ⽂件
```
// 开发环境配置
devtool:"cheap-module-eval-source-map",
//线上不推荐开启
devtool:"cheap-module-source-map", // 线上⽣成配置
```

## WebpackDevServer
``npm install webpack-dev-server -D``
修改下package.json
```
"scripts": {
 "server": "webpack serve"
 },
```
在webpack.config.js配置
```
devServer: {
    static: "./dist",
    open: true,
    port: 8081,
    proxy: {
      "/api": {
        target: "http://localhost:9092",
      },
    },
}
```
启动服务后，会发现dist⽬录没有了，这是因为devServer把打包后的模块不会放在dist⽬录下，⽽是放到内存中，从⽽提升速度
## Hot Module Replacement (HMR:热模块替换)
- css模块HMR JS模块HMR
- 不⽀持抽离出的css 我们要使⽤style-loader
启动hmr
```
devServer: {
    static: "./dist",
    open: true,
    port: 8081,
    //实例所使用的版本已经不需要手动配置默认开启
    // hot:true,
    //即便HMR不⽣效，浏览器也不⾃动刷新，就开启hotOnly jshmr使用
    // hotOnly:true,
    proxy: {
      "/api": {
        target: "http://localhost:9092",
      },
    },
}
```
配置⽂件头部引⼊webpack  
``const webpack = require("webpack");``  
在插件配置处添加  
```
new webpack.HotModuleReplacementPlugin()
```
### 处理css模块HMR
注意启动HMR后，**css抽离会不⽣效**，还有不⽀持contenthash，chunkhash
### 处理js模块HMR
#### 原理
关闭浏览器刷新hotOnly:true,再使⽤module.hot.accept来观察模块更新 从⽽更新
```
if(module.hot){
  module.hot.accept('模块路径',()=>{
    // 通过id找到对应模块
    //移除
    //重新执行
  })
}
```
#### [其他代码和框架](https://webpack.docschina.org/guides/hot-module-replacement/#other-code-and-frameworks)
常用的vue、react对应的loader都已经提供相应的功能
## Babel处理js语法和特性问题
Babel在执⾏编译的过程中，会从项⽬根⽬录下的 .babelrc⽂件中读取配置。没有该⽂件会从loader的options地⽅读取配置。
### @babel/plugin-transform-runtime
``npm install --save-dev @babel/plugin-transform-runtime babel-loader @babel/core @babel/preset-env``  
``npm install --save @babel/runtime @babel/runtime-corejs3``  
```
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    //目标环境
                    "edge": "8",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11"
                  }
                // "corejs": 2 //新版本需要指定核⼼库版本
                // "useBuiltIns": "usage" //按需注⼊
            }
        ]
    ],
    "plugins": [
        [
          "@babel/plugin-transform-runtime",
          {
            "corejs": 3 // 指定 runtime-corejs 的版本，目前有 2 3 两个版本
          }
        ]
    ]
}
```

## 优化

## 规范