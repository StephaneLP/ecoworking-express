const express = require('express')
const router = express.Router()
const signController = require('../controllers/sign.controller')

router.route('/inscription')
    .post(signController.signUp)

router.route('/authentification')
    .post(signController.signIn)

module.exports = router