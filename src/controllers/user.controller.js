const log = require('../utils/log')
const crud = require('./common/crud')
const {userTableDef} = require('../models/user.model')
const {trimStringValues, hashPassword} = require('../utils/tools')

/*********************************************************
[INSCRIPTION] CREATE / POST / INSERT INTO
*********************************************************/

const createUser = async (req, res) => {
    const body = trimStringValues(req.body)

    // Hachage du mot de passe
    const hash = await hashPassword(body.password)
    if (!hash.success) {
        res.status(500).json({status: 'error', code: 500, message: 'Erreur Serveur'})
        log.addError(`Code : 500 ; Fonction : createUser/hashPassword ; Message : ${hash.msg}`)        
    }
    body.password = hash.password

    // Contrôle du format l'email
    const exp = /([\w-.]+@[\w.]+\.{1}[\w]+)/
    if (!exp.test(body.email)) {
        res.status(400).json({status: 'error', code: 400, message: 'Le format de l\'email est incorrect'})
        log.addError(`Code : 400 ; Fonction : createUser ; Message : Format email incorrect`)        
    }

    // Ajout des colonnes non transmises (valeurs par défaut)
    body['is_verified'] = 0
    body['icon_color'] = `#${process.env.SIGNUP_ICON_COLOR}`
    body['role_id'] = Number(process.env.SIGNUP_ROLE_ID)
    body['icon_id'] = Number(process.env.SIGNUP_ICON_ID)

    const params = {
        bodyParams: body,
        libelles: {
            method: 'createUser',
            fail: 'Une erreur est survenue lors de la création du compte',
            success: 'Le compte a bien été créé',
        }
    }

    crud.createRecord(params, userTableDef)(req, res)
}

module.exports = {createUser}