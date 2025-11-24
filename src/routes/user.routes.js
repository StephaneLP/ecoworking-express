const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.route('/')
    .get(userController.readUsers)

router.route('/liste/')
    .get(userController.readUserList)

router.route('/:id')  
    .get(userController.readUserById)
    .delete(userController.deleteUserById)
    .put(userController.updateUserById)

module.exports = router