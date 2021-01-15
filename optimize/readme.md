## 优化resolve配置
- resolve配置模块如何解析。
  - resolve.modules
    - 告诉 webpack 解析模块时应该搜索的目录,默认是node_modules
    - 如果没有会依次往上层目录结构查找
    - 如果我们项目的模块都安装在项目的根目录下，就可以指明这个路径  
    ```
    const path = require('path');

    module.exports = {
      //...
      resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      },
    };
    ```
    - resolve.alias配置通过别名来将原导⼊路径映射成⼀个新的导⼊路径
      - 就是把绝对路径写在了配置里
      - 需要使用的地方直接使用对应的别名即可，简化导入操作
      ```
      resolve: {
        alias: {
          "@assets": path.resolve(__dirname, "../src/images/"),
          "@": path.join(__dirname, "./pages"),
          react: path.resolve(
          __dirname,
          "./node_modules/react/umd/react.production.min.js"
          ),
          "react-dom": path.resolve(
          __dirname,
          "./node_modules/react-dom/umd/react-dom.production.min.js"
          )
        },
      },
      
      //html-css中使⽤
      .sprite3 {
        background: url("~@assets/s3.png");
      }
      ```
    - resolve.extensions``extensions:['.js','.json','.jsx','.ts']``
      - 导入语句没有带后缀的时候，webpack会自动带上去，尝试查找文件是否存在。
      - 属于开发使用体验优化，但是还是建议带上，这个多了还是影响打包速度的
## 利用多线程提升构建速度
- webpack是运行在node之上的，时单线程。但是我们可以利用cpu的多核同时运行加快速度。
- 但是这个不是绝对的，如果电脑配置不好，不一定能起到正效果，例如开启多线程耗时过多等
## [thread-loader](https://webpack.docschina.org/loaders/thread-loader/#root)是针对loader进行优化的
- 它将loader放置在一个worker池里面运行，以达到多线程构建。
- 使用时，需要将其放置在其他loader之前
- 如果耗时不大不建议开启，每一个worker都是一个独立的nodejs进程，开销大约为600ms左右；同时还有一些其他限制
  - 这些 loader 不能生成新的文件。
  - 这些 loader 不能使用自定义的 loader API（也就是说，不能通过插件来自定义）。
  - 这些 loader 无法获取 webpack 的配置。
```
{
  test: /\.js$/,
  include: path.resolve('src'),
  use: [
    'thread-loader'
    // 你的⾼开销的loader放置在此 
  ]
}
```
- 本示例中强行开启了多线程处理字体文件，实际打包时间反而变长了，因为字体文件很小数量也少，开启多线程本身消耗的时间反而更长
## 缓存cache相关
- babel-loader
  - webpack打包中核心是js文件的打包
  - 除了设置**exclude** 和 **include**以外，在执行的时候可能会产生一些运行期间重复的公用文件，造成代码体积冗余，减缓打包速度。
  - babel-loader提供了``cacheDirectory``配置给babel编译时给定的目录，并将用于缓存加载器的结果。
  - ``node_modules/.cache/babel-loader`` ，如果在任何根⽬录下都没有找到 ``node_modules`` ⽬录，将会降级回退到操作系统默认的临时⽂件⽬录。
  ```
  {
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
      cacheDirectory: true
    },
  }
  ```
## 压缩速度优化
- 用terser-webpack-plugin压缩可以开启多线程和缓存
```
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  optimization: {
  minimizer: [
    new TerserPlugin({
      cache: true, // 开启缓存
      parallel: true // 多线程
    })
  ]
  }
};
```
## 使⽤externals优化cdn静态资源 
- 使用cdn打包的bundle文件就不用包含这些依赖了，体积会小
- 使用的时候，配置 ``externals``，任然可以通过``import``的方式引入，并且打包的时候不会对其打包
```
//webpack.config.js
module.exports = {
//...
  externals: {
    //jquery通过script引⼊之后，全局中即有了 jQuery 变量
    'jquery': 'jQuery'
  }
}
```
- 使用静态资源路径publicPath（CDN）
  - CDN通过将资源部署到世界各地，使得用户访就近访问资源，加快访问速度。
  - 使用配置在CDN服务器上面的资源
  ```
  output:{
    publicPath: '//cdnURL.com', //指定存放JS⽂件的CDN地址
  }
  ```
  - 不建议使用免费的CDN，不稳定
## 缩小文件搜索范围
- loader
  - test include exclude三个配置项来缩⼩loader的处理范围
  - 推荐使用include指定搜索目录
  - exclude 优先级要优于 include 和 test ，所以当三者配置有冲突时， exclude 会优先于其他两
个配置。
- plugin

## development vs Production模式区分打包
``npm install webpack-merge -D``