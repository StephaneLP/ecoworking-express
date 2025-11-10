const bcrypt = require('bcrypt')

/*********************************************************
GESTION DES MOTS DE PASSE
*********************************************************/

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

module.exports = {hashPassword, comparePasswords}