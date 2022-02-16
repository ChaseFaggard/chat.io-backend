export const getRandomColor = () => {
    let r = (Math.random()*127 + 100) >>0
    let g = (Math.random()*127 + 100) >>0
    let b = (Math.random()*127 + 100) >>0
    return "rgba(" + r + ", " + g + ", " + b + ", 1)"
}

export const getRandomIndex = () => {
    return Math.floor(Math.random() * 45);
}