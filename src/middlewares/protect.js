const jwt = require("jsonwebtoken")
const {sendError} = require('../utils/result')

const authenticate = (req, res, next) => {
    try {
        if (!req.headers['authorization']) {
            return sendError(res, 401, 'authenticate', 'Authentification impossible', 'Champ authorization absent du header')  
        }

        const token = req.headers['authorization'].split(' ')[1]
        if (!token) {
            return sendError(res, 401, 'authenticate', 'Authentification impossible', 'Token absent du champ authorization')  
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
    return (req, res) => {

        next()        
    }
}

module.exports = {authenticate, authorize}