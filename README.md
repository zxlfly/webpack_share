# basics
webpack基础

# custom
自定义工程从零到一

# multiple
自定义多页应用工程

# babel
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
