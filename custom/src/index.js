// import css from './css/index.scss'
// import pic from './images/6.jpg'
// import counter from "./counter";
// import number from "./number";
// const img = new Image()
// img.src = pic
// document.getElementById('app').appendChild(img)
// console.log('async sync');
// counter();
// number();
// if (module.hot) {
//     module.hot.accept("./number.js", function () {
//         document.body.removeChild(document.getElementById("number"));
//         number();
//     });
// }
const arr = [new Promise(() => {}), new Promise(() => {})];
arr.map((item) => {
  console.log(item);
});