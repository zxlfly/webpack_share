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

## development vs Production模式区分打包
``npm install webpack-merge -D``  
新建三个webpack的配置文件，文件名作如下区分：  
- base基础公用的部分
- dev开发配置部分
- prod生产配置部分


### HtmlWebpackPlugin压缩配置（html）
```
//示例中的代码
new HtmlWebpackPlugin({
    template:path.join(__dirname,`./src/pages/${match[1]}/${match[1]}.html`),
    filename:`pages/${match[1]}.html`,
    chunks:[match[1]],
    minify:{
        removeComments:true,
        collapseWhitespace:true,
        minifyCSS:true
    }
})
```

### css压缩
``css-loader``中已经集成了``cssnano``，我们还可以使用``optimize-css-assets-webpack-plugin``来⾃定义 ``cssnano`` 的规则。它的默认css压缩引擎就是``cssnano``。
```
npm install cssnano -D
npm i optimize-css-assets-webpack-plugin -D
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
new OptimizeCSSAssetsPlugin({
  cssProcessor: require("cssnano"), // 这⾥制定了引擎，不指定默认也是 cssnano
  cssProcessorOptions: {
    discardComments: { removeAll: true }
  }
})
```


### 压缩js
**production**模式下webpack会自动压缩，我们也可以自定义压缩工具。例如：``terser-webpack-plugin``,这是一个官方维护的插件，可以处理es6代码。
```
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin()
    ]
  }
};
```
实际的开发中，我们可以通过移除一些不用的代码优化体积，``Tree-Shaking``也是依赖这个插件
```
new TerserPlugin({
  // 使⽤ cache，加快⼆次构建速度
  cache: true,
  terserOptions: {
    comments: false,
    compress: {
      // 删除⽆⽤的代码
      unused: true,
      // 删掉 debugger
      drop_debugger: true,
      // 移除 console
      drop_console: true,
      // 移除⽆⽤的代码
      dead_code: true
    }
  }
});
```

压缩发布的时候耗时问题可以通过``terser-webpack-plugin``来开启多线程来加速
```
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  optimization: {
    minimizer: [new TerserPlugin(
      parallel: true // 多线程
    )],
  },
};
```

### tree Shaking：擦除⽆⽤的JS,CSS
**Css tree shaking**
```
npm install glob-all purify-css purifycss-webpack -D
const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')
plugins:[
  // 清除⽆⽤ css
  new PurifyCSS({
    paths: glob.sync([
    // 要做 CSS Tree Shaking 的路径⽂件
    path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对 html ⽂件进⾏ tree shaking
    path.resolve(__dirname, './src/*.js')
    ])
  })
]
```
**JS tree shaking**只⽀持import⽅式引⼊，不⽀持commonjs的⽅式引⼊  
```
//expo.js
export const add = (a, b) => {
 return a + b;
};
export const minus = (a, b) => {
 return a - b;
};
//index.js
import { add } from "./expo";
add(1, 2);
//webpack.config.js
optimization: {
  usedExports: true // 哪些导出的模块被使⽤了，再做打包
}
```
**只要mode是production就会⽣效，develpoment的tree shaking是不⽣效的，因为webpack为了⽅便你的调试**


### sideEffects
⽣产模式不需要配置，默认开启
```
//package.json
"sideEffects":false //正常对所有模块进⾏tree shaking , 仅⽣产模式有效，需要配合
usedExports
或者 在数组⾥⾯排除不需要tree shaking的模块
"sideEffects":['*.css','@babel/polyfill']
```

### 代码分割 code Splitting
单页应用打包完之后只生成一个bundle.js，体积大不利于加载速度
```
import _ from "lodash";
console.log(_.join(['a','b','c','****']))
假如我们引⼊⼀个第三⽅的⼯具库，体积为1mb，⽽我们的业务逻辑代码也有1mb，那么打包出来的体积⼤⼩会在2mb
导致问题：
 体积⼤，加载时间⻓
 业务逻辑会变化，第三⽅⼯具库不会，所以业务逻辑⼀变更，第三⽅⼯具库也要跟着变。
 optimization: {
   //帮我们⾃动做代码分割
  splitChunks: {
    //默认是⽀持异步，我们使⽤all
    // 所有的 chunks 代码公共的部分分离出来成为⼀个单独的⽂件
    chunks: "all", 
  },
 },
```
```
optimization: {
 splitChunks: {
    chunks: 'async',//对同步 initial，异步 async，所有的模块有效 all
    minSize: 30000,//最⼩尺⼨，当模块⼤于30kb
    maxSize: 0,//对模块进⾏⼆次分割时使⽤，不推荐使⽤
    minChunks: 1,//打包⽣成的chunk⽂件最少有⼏个chunk引⽤了这个模块
    maxAsyncRequests: 5,//最⼤异步请求数，默认5
    maxInitialRequests: 3,//最⼤初始化请求书，⼊⼝⽂件同步请求，默认3
    automaticNameDelimiter: '-',//打包分割符号
    name: true,//打包后的名称，除了布尔值，还可以接收⼀个函数function
    cacheGroups: {//缓存组
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name:"vendor", // 要缓存的 分隔出来的 chunk 名称
        priority: -10//缓存组优先级 数字越⼤，优先级越⾼
      },
      other:{
        chunks: "initial", // 必须三选⼀： "initial" | "all" | "async"(默认就是async)
        test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk,
        name:"other",
        minSize: 30000,
        minChunks: 1,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true//可设置是否重⽤该chunk
      }
    }
 }
}
 ```

### Scope Hoisting
作用域提升是指webpack通过es6语法的静态分析，分析出来模块之间的依赖关系，尽可能的吧模块放到同一个函数。
```
// hello.js
export default 'Hello, Webpack';
// index.js
import str from './hello.js';
console.log(str);
```
打包之后，``hello.js``的内容和``index.js``会分开  
通过配置`` optimization.concatenateModules=true``开启
```
// webpack.config.js
module.exports = {
  optimization: {
    concatenateModules: true
  }
};
```


### 使⽤⼯具量化
``speed-measure-webpack-plugin``可以测量各个插件和 loader 所花费的时间
```
npm i speed-measure-webpack-plugin -D
//webpack.config.js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const config = {
 //...webpack配置
}
module.exports = smp.wrap(config);
```
``webpack-bundle-analyzer``分析webpack打包后的模块依赖关系
```
npm install webpack-bundle-analyzer -D
const BundleAnalyzerPlugin = require('webpack-bundleanalyzer').BundleAnalyzerPlugin;
module.exports = merge(baseWebpackConfig, {
  plugins: [
      new BundleAnalyzerPlugin(),
  ]
})
```