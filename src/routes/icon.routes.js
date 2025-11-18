const express = require('express')
const router = express.Router()
const iconController = require('../controllers/icon.controller')
const {authenticate, authorize} = require('../middlewares/protect')

router.route('/')
    .get(iconController.readIcons)
    .post(iconController.createIcon)

router.route('/liste/')
    .get(iconController.readIconList)

router.route('/:id')    
    .get(iconController.readIconById)
    .delete(iconController.deleteIconById)
    .put(iconController.updateIconById)

module.exports = router