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
INSCRIPTION, AUTHENTIFICATION, AUTHORISATION
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

// Hachage du mot de passe
const saltRounds = 10
const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)

        return {success: true, password: hashedPassword}
    } catch (err) {
        return {success: false, msg: `${err.name}, ${err.message}`}
    }
}

// Comparaison des mots de passe
const comparePasswords = async (password, dbPassword) => {
    try {
        return await bcrypt.compare(password, dbPassword)
    }
    catch(err) {
        throw new Error(`Erreur lors de la vérification du mot de passe (${err.name} : ${err.message})`)
    }
}

module.exports = {trimStringValues, stringAsInteger, stringAsBoolean, checkEmailFormat, checkNickNameFormat, checkPasswordFormat, hashPassword, comparePasswords}