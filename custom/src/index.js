import css from './css/index.scss'
import pic from './images/6.jpg'
const img = new Image()
img.src=pic
document.getElementById('app').appendChild(img)
console.log('async sync');