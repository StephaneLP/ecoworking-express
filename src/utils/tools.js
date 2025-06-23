function isInteger(str) {
    const numbers = ['0','1','2','3','4','5','6','7','8','9']
    let res = true
    for (let el of str) {
        if (!numbers.includes(el.toString())) return false
    }
    return res
}

module.exports = {isInteger}