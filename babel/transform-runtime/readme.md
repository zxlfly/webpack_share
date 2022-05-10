这种方法需要安装
``@babel/runtime``、
``@babel/plugin-transform-runtime``、
``@babel/runtime-corejs3``  
默认情况下**transform-runtime**是不开启core-js的polyfill处理，安装``@babel/runtime``就够了。如果需要开启得使用@babel/runtime另外的版本``@babel/runtime-corejs3``就可以了  
### useBuiltIns
控制preset使用何种方式帮我们导入polyfill的核心，有三种参数
- ``entry``: 需要在 webpack 的⼊⼝⽂件⾥ import "@babel/polyfill" ⼀次。 babel 会根据你的使⽤情况导⼊垫⽚，没有使⽤的功能不会被导⼊相应的垫⽚。
- ``usage``: 不需要import ，全⾃动检测，但是要安装 @babel/polyfill 。（试验阶段）
- ``false``: 如果你 import"@babel/polyfill" ，它不会排除掉没有使⽤的垫⽚，程序体积会庞⼤。(不推荐)

### **plugin-transform-runtime** 主要做了三件事
- 当开发者使用异步或生成器的时候，自动引入@babel/runtime/regenerator，开发者不必在入口文件做额外引入；
- 动态引入 polyfill，提供沙盒环境，避免全局环境的污染；
- 如果直接导入 core-js 或 @babel/polyfill 以及它提供的 Promise、Set 和 Map 等内置组件，这些都会污染全局。虽然这不影响应用程序或命令行工具，但如果代码是要发布给其他人使用的库，或者无法准确控制代码将运行的环境，则会出现问题。
- 所有 helpers 帮助模块都将引用模块 @babel/runtime，以避免编译输出中的重复，减小打包体积；

### helpers
配置值 boolean 类型，默认值 true。
是否用对 moduleName 的调用替换内联 Babel 帮助程序（classCallCheck、extends等）。

### regenerator
配置值 boolean 类型，默认值 true。
是否将生成器函数转换为使用不污染全局范围的再生器运行时。

### useESModules
配置值 boolean 类型，默认值 false。
启用后，转换将使用帮助程序，而不是@babel/plugin-transform-modules-commonjs。这允许在 webpack 等模块系统中进行较小的构建，因为它不需要保留 commonjs 语义。