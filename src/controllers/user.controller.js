const jwt = require("jsonwebtoken")
const crud = require('./common/crud')
const {userTableDef} = require('../models/user.model')
const {sendError} = require('../utils/result')
const {trimStringValues} = require('../utils/tools')
const tools = require('./common/tools')

/*********************************************************
[INSCRIPTION] CREATE / POST / INSERT INTO
*********************************************************/

const createUser = async (req, res) => {
    const body = trimStringValues(req.body)

    // Contrôle du format l'email
    if (!tools.checkEmailFormat(body.email)) {
        return sendError(res, 400, 'createUser', 'Le format de l\'email est incorrect', '')    
    }

    // Contrôle du format du pseudo
    if (!tools.checkNickNameFormat(body.nickname)) {
        return sendError(res, 400, 'createUser', 'Le format du pseudo est incorrect', '')      
    }

    // Contrôle du format du mot de passe
    if (!tools.checkPasswordFormat(body.password)) {
        return sendError(res, 400, 'createUser', 'Le format du mot de passe est incorrect', '')        
    }

    // Hachage du mot de passe
    const hash = await tools.hashPassword(body.password)
    if (!hash.success) {
        return sendError(res, 500, 'createUser/hashPassword', 'Erreur Serveur', hash.msg)
    }
    body.password = hash.password

    // Colonnes avec des valeurs par défaut
    body['is_verified'] = 0
    body['icon_color'] = `#${process.env.SIGNUP_ICON_COLOR}`
    body['role_id'] = Number(process.env.SIGNUP_ROLE_ID)
    body['icon_id'] = Number(process.env.SIGNUP_ICON_ID)

    const params = {
        bodyParams: body,
        functionName: 'createUser',
    }

    crud.createRecord(params, userTableDef)(req, res)
}

/*********************************************************
[CONNEXION] 
*********************************************************/

const connectUser = async (req, res) => {
    const body = trimStringValues(req.body)
    const email = body.email || null
    const password = body.password || null

    try {
        // Vérification de la présence des paramètres dans le body
        if (!email || !password) {
            return sendError(res, 400, 'connectUser', 'Connexion impossible, email ou mot de passe manquant', '')
        }

        // Requête pour trouver l'utilisateur correspondant à l'email
        const params = {
            queryParams: [{column: 'email', op: '=', values: [email]}]
        }
        const user = await crud.getRecordByParams(params, userTableDef)

        // Un utilisateur a-t'il été trouvé ? Si non message d'erreur
        if (user.length === 0) {
            return sendError(res, 401, 'connectUser', 'Identifiant ou mot de passe incorrect', '')
        }

        // Le mot de passe correspond-il ? Si non message d'erreur
        const match = await tools.comparePasswords(password, user[0].password)
        if (!match) {
            return sendError(res, 401, 'connectUser', 'Identifiant ou mot de passe incorrect', '')
        }
        
        // Création du token et réponse au client
        const token = jwt.sign({userId: user[0].id}, process.env.SECRET_JWT_KEY, {expiresIn: '48h'})
        sendResult(res, 200, 'connectUser', 'Authentification validée (1 token envoyé)', 1, [{token: token, nickname: user[0].nickname}])
    }
    catch(err) {
        sendError(res, 500, 'connectUser', 'Erreur Serveur', err.message)
    }
}

module.exports = {createUser, connectUser}