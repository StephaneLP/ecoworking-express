function trimStringValues(reqQuery) {
    const query = {}
    
    Object.entries(reqQuery).forEach(e => {
        query[e[0]] = (typeof e[1] === 'string' ? e[1].trim() : e[1])
    })
    return query
}

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

function booleanToNumber(str) {
    if (str.toLowerCase() === 'true') return true
    if (str.toLowerCase() === 'false') return false
    return str
}

module.exports = {trimStringValues, stringAsInteger, stringAsBoolean, booleanToNumber}