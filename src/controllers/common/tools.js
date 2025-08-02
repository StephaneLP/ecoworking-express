const bcrypt = require('bcrypt')
const {isParentTable} = require('../../config/db.params')

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


/*********************************************************
MISE EN FORME DE LA RÉPONSE DE LA REQUÊTE
*********************************************************/

const formatSelectResponse = (params, dbRes) => {
    const mainTable = params.tables.mainTable
    const joinTables = params.tables.joinTables
    const mainTableName = mainTable.model.tableName
    let joinTableName, columns
    const arrResult = []

    for (let line of dbRes) {          
        columns = {...line[mainTableName]}
        for (let table of joinTables) {  
            joinTableName = table.model.tableName
            if (!isParentTable(mainTableName, joinTableName)) {
                columns[joinTableName] = {...line[joinTableName]}
            }
        }
        arrResult.push(columns)
        columns = {}
    }
 
    // return arrResult
    return dbRes
}

module.exports = {checkEmailFormat, checkNickNameFormat, checkPasswordFormat, hashPassword, comparePasswords, formatSelectResponse}