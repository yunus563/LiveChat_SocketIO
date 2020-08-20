
const colors = ['blue', 'green','red', 'a','b','s','d',]
const random = () =>{
    return colors[Math.floor(Math.random() * colors.length)]
}

module.exports = random;