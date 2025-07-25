const jwt = require("jsonwebtoken")
const queries = require('../models/common/queries')
const {sendError} = require('../utils/result')

const authenticate = (req, res, next) => {
    try {
        if (!req.headers['authorization']) {
            return sendError(res, 401, 'authenticate', 'L\'authentification a échoué, accès à la ressource refusé', 'champ authorization absent du header')  
        }

        const token = req.headers['authorization'].split(' ')[1]
        if (!token) {
            return sendError(res, 401, 'authenticate', 'L\'authentification a échoué, accès à la ressource refusé', 'token absent du champ authorization')  
        }

        const payload = jwt.verify(token, process.env.SECRET_JWT_KEY)
        req['userId'] = payload['userId']

        next()
    }
    catch(err) {
        sendError(res, 500, 'authenticate', 'Erreur Serveur', `${err.name} - ${err.message}`)
    }
}

const authorize = (roles) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId
            if (!userId) {
                return sendError(res, 403, 'authorize', 'Droits insuffisants, accès à la ressource refusé', 'userId absent du token')
            }

            // Requête pour trouver l'utilisateur correspondant à l'id userId
            const sql = 'SELECT role.lib as role FROM user INNER JOIN role ON user.role_id = role.id WHERE user.id=?'
            const user = await queries.runGetQuery(sql, [userId])
            const userRole = user[0].role

            if (!roles.includes(userRole)) {
                return sendError(res, 403, 'authorize', 'Droits insuffisants, accès à la ressource refusé', `le role de l\'utilisateur (id: ${userId}) ne permet pas d\'accéder à la route`)
            }

            next()        
        }
        catch(err) {
            sendError(res, 500, 'connectUser', 'Erreur Serveur', err.message)
        }
    }
}

module.exports = {authenticate, authorize}