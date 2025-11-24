const user = require('../models/user.model')
const role = require('../models/role.model')
const jwt = require("jsonwebtoken")
const crud = require('./common/crud')
const queries = require('../models/common/runQueries')
const {sendResult, sendError} = require('./common/result')
const {hashPassword, comparePasswords} = require('./common/auth')
const {trimStringValues, checkEmailFormat, checkNickNameFormat, checkPasswordFormat} = require('../utils/tools')
const {sendMailRegistration} = require('../utils/mail')
const {op} = require('../config/db.params')

/*********************************************************
[INSCRIPTION] CREATE / POST / INSERT INTO
*********************************************************/

const signUp = async (req, res) => {
    const body = trimStringValues(req.body)

    // Contrôle du format l'email
    if (!checkEmailFormat(body.email)) {
        return sendError(res, 400, 'signUp', 'Le format de l\'email est incorrect', '')    
    }

    // Contrôle du format du pseudo
    if (!checkNickNameFormat(body.nickname)) {
        return sendError(res, 400, 'signUp', 'Le format du pseudo est incorrect', '')      
    }

    // Contrôle du format du mot de passe
    if (!checkPasswordFormat(body.password)) {
        return sendError(res, 400, 'signUp', 'Le format du mot de passe est incorrect', '')        
    }

    // Hachage du mot de passe
    const hash = await hashPassword(body.password)
    if (!hash.success) {
        return sendError(res, 500, 'createUser/hashPassword', 'Erreur Serveur', hash.msg)
    }
    body.password = hash.password

    // Ajout des colonnes absentes du body (valeurs par défaut)
    body['is_verified'] = 0
    body['icon_color'] = `#${process.env.SIGNUP_ICON_COLOR}`
    body['role_id'] = Number(process.env.SIGNUP_ROLE_ID)
    body['icon_id'] = Number(process.env.SIGNUP_ICON_ID)

    const params = {
        table: user,
        bodyParams: body,
        functionName: 'signUp',
    }

    try {
        const dbRes = await queries.runQueryInsert(params)

        if (!dbRes.success) {
            return sendError(res, 400, `${params.functionName}/${dbRes.functionName}`, 'Erreur Requête', dbRes.msg)            
        }

        const token = jwt.sign({userId: dbRes.result.insertId}, process.env.SIGNUP_KEY, {expiresIn: process.env.DURATION_CONNECT_USER})
        const url = 'http://localhost:3000/inscription-confirm/' + token
        const info = await sendMailRegistration(body.email, 'Inscription site Ecoworking', body.nickname, url, 'mailSignUp.html')
        const message = `Un mail de confirmation a été envoyé à l'adresse suivante : ${info.accepted[0]}`

        sendResult(res, 200, params.functionName, message, dbRes.result.affectedRows, [])
    }
    catch(err) {
        sendError(res, 500, params.functionName, 'Erreur Serveur', err.message)
    }
}

/*********************************************************
[CONNEXION] 
*********************************************************/

const signIn = async (req, res) => {
    const body = trimStringValues(req.body)
    const email = body.email || null
    const password = body.password || null

    try {
        // Vérification de la présence des paramètres dans le body
        if (!email || !password) {
            return sendError(res, 400, 'signIn', 'Connexion impossible, email ou mot de passe manquant', '')
        }

        // Requête pour trouver l'utilisateur correspondant à l'email
        const sql = 'SELECT id, nickname, email, password FROM user WHERE email=?'
        const user = await queries.runGetQuery(sql, [email])

        // Un utilisateur a-t'il été trouvé ? Si non message d'erreur
        if (user.length === 0) {
            return sendError(res, 401, 'signIn', 'Identifiant ou mot de passe incorrect', '')
        }

        // Le mot de passe correspond-il ? Si non message d'erreur
        const match = await comparePasswords(password, user[0].password)
        if (!match) {
            return sendError(res, 401, 'signIn', 'Identifiant ou mot de passe incorrect', '')
        }
        
        // Création du token et réponse au client
        const token = jwt.sign({userId: user[0].id}, process.env.SIGNIN_KEY, {expiresIn: process.env.DURATION_CONNECT_USER})
        sendResult(res, 200, 'signIn', 'Authentification validée (1 token envoyé)', 1, [{token: token, nickname: user[0].nickname}])
    }
    catch(err) {
        sendError(res, 500, 'signIn', 'Erreur Serveur', err.message)
    }
}

module.exports = {signUp, signIn}