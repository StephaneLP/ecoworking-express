const express = require('express')
const router = express.Router()
const roleController = require('../controllers/role.controller')

router.route('/')
    .get(roleController.readRoles)

router.route('/liste/')
    .get(roleController.readRoleList)

module.exports = router