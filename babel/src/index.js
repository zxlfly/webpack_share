import "@babel/polyfill"
console.log(666);
const arr = [new Promise(() => {}), new Promise(() => {})];
async function zxl(){
    await setTimeout(()=>{
        het()
    })
}
function het(){
    console.log('het');
}
arr.map(item => {
 console.log(item);
});