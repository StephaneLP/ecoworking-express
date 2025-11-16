const user = require('../models/user.model')
const role = require('../models/role.model')
const jwt = require("jsonwebtoken")
const crud = require('./common/crud')
const queries = require('../models/common/runQueries')
const {sendResult, sendError} = require('./common/result')
const {hashPassword, comparePasswords} = require('./common/auth')
const {trimStringValues, checkEmailFormat, checkNickNameFormat, checkPasswordFormat} = require('../utils/tools')
const {op} = require('../config/db.params')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readUsers = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT...FROM...)
    const tables = {
        mainTable: [user, ['*']],
        joinTables : [[role, ['*']]]
    }

    // FILTRE (clause WHERE)
    const queryParams = []
    
    if(query.id) queryParams.push([user, 'id', op.in, query.id.split(',')])
    if(query.nickname) queryParams.push([user, 'nickname', op.like, [query.nickname], '%?%'])
    if(query.email) queryParams.push([user, 'email', op.like, [query.email], '%?%'])
    if(query.is_verified) queryParams.push([user, 'is_verified', op.equal, [query.is_verified]])

    // TRI (clause ORDER BY)
    const orderParams = [[user, query.sort || 'nickname', query.dir || 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readUsers',
    }

    crud.readRecords(params)(req, res)
}

const readUserList = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT...FROM...)
    const tables = {
        mainTable: [user, ['*']],
        joinTables : [[role, ['*']]]
    }

    // FILTRE (clause WHERE)
    const queryParams = []
    
    // TRI (clause ORDER BY)
    const orderParams = [[user, query.sort || 'nickname', query.dir || 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readUserList',
    }

    crud.readRecords(params)(req, res)
}

/*********************************************************
[INSCRIPTION] CREATE / POST / INSERT INTO
*********************************************************/

const createUser = async (req, res) => {
    const body = trimStringValues(req.body)

    // Contrôle du format l'email
    if (!checkEmailFormat(body.email)) {
        return sendError(res, 400, 'createUser', 'Le format de l\'email est incorrect', '')    
    }

    // Contrôle du format du pseudo
    if (!checkNickNameFormat(body.nickname)) {
        return sendError(res, 400, 'createUser', 'Le format du pseudo est incorrect', '')      
    }

    // Contrôle du format du mot de passe
    if (!checkPasswordFormat(body.password)) {
        return sendError(res, 400, 'createUser', 'Le format du mot de passe est incorrect', '')        
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
        functionName: 'createUser',
    }

    crud.createRecord(params)(req, res)
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
        const sql = 'SELECT id, nickname, email, password FROM user WHERE email=?'
        const user = await queries.runGetQuery(sql, [email])

        // Un utilisateur a-t'il été trouvé ? Si non message d'erreur
        if (user.length === 0) {
            return sendError(res, 401, 'connectUser', 'Identifiant ou mot de passe incorrect', '')
        }

        // Le mot de passe correspond-il ? Si non message d'erreur
        const match = await comparePasswords(password, user[0].password)
        if (!match) {
            return sendError(res, 401, 'connectUser', 'Identifiant ou mot de passe incorrect', '')
        }
        
        // Création du token et réponse au client
        const token = jwt.sign({userId: user[0].id}, process.env.SECRET_JWT_KEY, {expiresIn: process.env.DURATION_CONNECT_USER})
        sendResult(res, 200, 'connectUser', 'Authentification validée (1 token envoyé)', 1, [{token: token, nickname: user[0].nickname}])
    }
    catch(err) {
        sendError(res, 500, 'connectUser', 'Erreur Serveur', err.message)
    }
}

module.exports = {readUsers, readUserList, createUser, connectUser}