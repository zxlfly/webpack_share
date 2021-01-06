这种方法需要安装
``@babel/runtime``、
``@babel/plugin-transform-runtime``、
``@babel/runtime-corejs3``  
默认情况下**transform-runtime**是不开启core-js的polyfill处理，安装``@babel/runtime``就够了。如果需要开启得使用@babel/runtime另外的版本``@babel/runtime-corejs3``就可以了