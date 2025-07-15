const jwt = require("jsonwebtoken")
const log = require('../utils/log')
const crud = require('./common/crud')
const {userTableDef} = require('../models/user.model')
const tools = require('../utils/tools')

/*********************************************************
[INSCRIPTION] CREATE / POST / INSERT INTO
*********************************************************/

const createUser = async (req, res) => {
    const body = tools.trimStringValues(req.body)

    // Contrôle du format l'email
    if (!tools.checkEmailFormat(body.email)) {
        res.status(400).json({status: 'error', code: 400, message: 'Le format de l\'email est incorrect'})
        log.addError(`Code : 400 ; Fonction : createUser ; Message : Format de l\'email incorrect`)
        return      
    }

    // Contrôle du format du pseudo
    if (!tools.checkNickNameFormat(body.nickname)) {
        res.status(400).json({status: 'error', code: 400, message: 'Le format du pseudo est incorrect'})
        log.addError(`Code : 400 ; Fonction : createUser ; Message : Format du pseudo incorrect`)
        return          
    }

    // Contrôle du format du mot de passe
    if (!tools.checkPasswordFormat(body.password)) {
        res.status(400).json({status: 'error', code: 400, message: 'Le format du mot de passe est incorrect'})
        log.addError(`Code : 400 ; Fonction : createUser ; Message : Format du mot de passe incorrect`)
        return          
    }

    // Hachage du mot de passe
    const hash = await tools.hashPassword(body.password)
    if (!hash.success) {
        res.status(500).json({status: 'error', code: 500, message: 'Erreur Serveur'})
        log.addError(`Code : 500 ; Fonction : createUser/hashPassword ; Message : ${hash.msg}`)
        return
    }
    body.password = hash.password

    // Colonnes avec des valeurs par défaut
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

/*********************************************************
[CONNEXION] 
*********************************************************/

const connectUser = async (req, res) => {
    const body = tools.trimStringValues(req.body)
    const email = body.email || null
    const password = body.password || null

    try {
        // Vérification de la présence des paramètres dans le body
        if (!email || !password) {
            res.status(400).json({status: 'error', code: 400, message: 'Connexion impossible, email ou mot de passe manquant'})
            log.addError(`Code : 400 ; Fonction : createUser ; Message : Connexion impossible, email ou mot de passe manquant`)
            return
        }

        // Requête pour trouver l'utilisateur correspondant à l'email
        const params = {
            queryParams: [{column: 'email', op: '=', values: [email]}]
        }
        const user = await crud.getRecordByParams(params, userTableDef)

        // Un utilisateur a-t'il été trouvé ? Si non message d'erreur
        if (user.length === 0) {
            res.status(401).json({status: 'error', code: 401, message: 'Identifiant ou mot de passe incorrect'})
            log.addError('Code : 401 ; Fonction : connectUser ; Message : Identifiant ou mot de passe incorrect')
            return
        }

        // Le mot de passe correspond-il ? Si non message d'erreur
        const match = await tools.comparePasswords(password, user[0].password)
        if (!match) {
            res.status(401).json({status: 'error', code: 401, message: 'Identifiant ou mot de passe incorrect'})
            log.addError('Code : 401 ; Fonction : connectUser ; Message : Identifiant ou mot de passe incorrect')
            return
        }
        
        // Création du token et réponse au client
        const token = jwt.sign({data: user[0].id}, process.env.JWT_CONNECT_KEY, {expiresIn: '48h'})
        res.status(200).json({status: 'success', code: 200, data: {token: token, nickname: user[0].nickname}})
        log.addRequest('Code : 200 ; Fonction : connectUser ; Message : Connexion réussie, token envoyé')
    }
    catch(err) {
        res.status(500).json({status: 'error', code: 500, message: 'Erreur Serveur'})
        log.addError(`Code : 500 ; Fonction : connectUser ; Message : ${err.message}`)
    }
}

module.exports = {createUser, connectUser}