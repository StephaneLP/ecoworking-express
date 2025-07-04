function stringAsInteger(str) {
    const numbers = ['0','1','2','3','4','5','6','7','8','9']

    for (let el of str) {
        if (!numbers.includes(el)) return false
    }
    return true
}

function stringAsBoolean(str) {

    return ['0','1','true','false'].includes(str.toLowerCase())
}

function trimObjectValues(reqQuery) {
    const query = {}
    
    Object.entries(reqQuery).forEach(e => {
        query[e[0]] = e[1].toString().trim()
    })
    return query
}

function booleanToNumber(str) {
    if (str.toLowerCase() === 'true') return '1'
    if (str.toLowerCase() === 'false') return '0'
    return str
}

module.exports = {stringAsInteger, stringAsBoolean, trimObjectValues, booleanToNumber}