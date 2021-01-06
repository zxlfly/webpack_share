const fs = require("fs")
const os = require('os');
const path = require("path")
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const {transformFromAst} = require('@babel/core')
// slash= os.type()=='Windows_NT'?'.\\':'./'
module.exports = class webpack{
    constructor(options){
        this.entry = options.entry;
        this.output = options.output;
        this.modules = [];
    }
    run(){
        const res = this.parse(this.entry)
        this.modules.push(res)
        //循环处理深度依赖问题  但是这里没有处理相互依赖的问题
        for (let i = 0; i < this.modules.length; i++) {
            const item = this.modules[i];
            if(item.dep){
                for (const j in item.dep) {
                    this.modules.push(this.parse(item.dep[j]))
                }
            }
        }
        //转换成对象
        const obj = {}
        this.modules.forEach(item=>{
            obj[item.entryFile]={
                dep:item.dep,
                code:item.code
            }
        })
        // console.log(obj);
        this.pack(obj)
    }
    parse(entryFile){
        // 根据入口地址去读取文件内容
       const context = fs.readFileSync(entryFile,'utf-8')
        // 通过"@babel/parser"转换成 ast的形式
        const ast = parser.parse(context,{
            sourceType:"module"
        })
        // 依赖
        const dep = {}
        // 通过"@babel/traverse"将type为ImportDeclaration的过滤出来
        traverse(ast,{
            ImportDeclaration({node}){
                // path.dirname 解析文件所在目录
                // const newPath = slash + path.join(path.dirname(entryFile),node.source.value)
                const newPath = path.join(path.dirname(entryFile),node.source.value)
                dep[node.source.value]=newPath
            }
        })
        const {code} = transformFromAst(ast,null,{
            presets:["@babel/preset-env"]
        })
        return {
            entryFile,
            dep,
            code
        }
    }

    pack(obj){
        // 生成main.js到dist目录
        const filePath = path.join(this.output.path,this.output.filename)
        // 生成bundle内容
            //从入口开始
            //将编译之后的code执行
            // 由于编译之后code里的路径相对于根目录不是src目录，需要处理->pathRequire
            
        const bundle = `(function(modules){
            function require(module){
                function newRequire(relativePath){
                   return require(modules[module].dep[relativePath])
                }
                var exports={};
                (function(require,code){
                    eval(code)
                })(newRequire,modules[module].code)
                return exports;
            }
            require('${this.entry}')
        })(${JSON.stringify(obj)})`
        fs.writeFileSync(filePath,bundle,'utf-8')
    }
}