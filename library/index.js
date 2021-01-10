// 环境区分
"user strict"
if(process.env.NODE_ENV==="production"){
    module.exports=require('./dist/addnum.min')
}else{
    module.exports=require('./dist/addnum')
}
// 我们把这个库上传到npm
// 用户下载使用的时候就是通过这个文件为入口导入的
// 根据环境不同引入的文件不一样

// 为什么是index.js？
// 因为初始化的时候package.js里面的入口（main）默认就是index.js

// 最后就是上传库
// 需要npm的账号密码
// npm login 登录 
// 如果设置了镜像源，需要换回来
// npm config set registry https://registry.npmjs.org
// 登录之后执行npm publish上传即可
// 更新的时候需要更改版本号


// 关于源的管理可以使用nrm 更方便
// npx nrm use npm
// npx nrm use taobao