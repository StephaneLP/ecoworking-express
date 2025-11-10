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

/*********************************************************
OUTILS DE VÉRIFICATION
*********************************************************/

// Contrôle du format l'email
const checkEmailFormat = (email) => {
    const exp = /([\w-.]+@[\w.]+\.{1}[\w]+)/
    return exp.test(email)
}

// Contrôle du format du pseudo
const checkNickNameFormat = (nickname) => {
    const exp = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9]{5,}$/
    return exp.test(nickname)
}

// Contrôle du format du mot de passe
const checkPasswordFormat = (password) => {
    const exp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return exp.test(password)
}

module.exports = {trimStringValues, stringAsInteger, stringAsBoolean, checkEmailFormat, checkNickNameFormat, checkPasswordFormat}