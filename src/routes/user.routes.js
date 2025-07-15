const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.route('/inscription')
    .post(userController.createUser)

router.route('/connexion')
    .post(userController.connectUser)

module.exports = router