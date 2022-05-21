import css from '../../css/index'
import pic from '../../images/6.jpg'
console.log(pic);
const img = new Image()
img.src = pic
document.getElementById('app').appendChild(img)
console.log('async sync');