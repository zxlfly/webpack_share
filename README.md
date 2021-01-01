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

# reactapp