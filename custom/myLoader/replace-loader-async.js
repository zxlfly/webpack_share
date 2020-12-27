// 非箭头函数
// 必须有返回值
// source匹配到的文件
// module.exports=function(source){
//     // 通过this 调用webpack提供的api
//     // 都挂在this上，所以不能用箭头函数
//     console.log(this.query);
//     // return source.replace("hello",this.query.name)
//     this.callback(null,source.replace("hello",this.query.name))
// }
// 异步
module.exports=function(source){
    console.log(this.query);
    const callback = this.async()
    setTimeout(()=>{
        this.callback(null,source.replace("hello",this.query.name))
    },300)
}