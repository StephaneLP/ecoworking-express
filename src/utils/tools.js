const bcrypt = require('bcrypt')

/*********************************************************
ANALYSE ET MANIPULATION DES VARIABLES
*********************************************************/

// Fonction trim() appliquée aux valeurs string d'un objet
function trimStringValues(reqQuery) {
    const query = {}
    
    Object.entries(reqQuery).forEach(e => {
        query[e[0]] = (typeof e[1] === 'string' ? e[1].trim() : e[1])
    })
    return query
}

// Vérification qu'une variable string représente un entier positif
function stringAsInteger(str) {
    const numbers = ['0','1','2','3','4','5','6','7','8','9']

    for (let el of str) {
        if (!numbers.includes(el)) return false
    }
    return true
}

// Vérification qu'une variable string représente un booléen
function stringAsBoolean(str) {
    return ['0','1','true','false'].includes(str.toLowerCase())
}

module.exports = {trimStringValues, stringAsInteger, stringAsBoolean}