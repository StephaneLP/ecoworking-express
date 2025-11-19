const express = require('express')
const router = express.Router()
const iconTypeController = require('../controllers/iconType.controller')
const {authenticate, authorize} = require('../middlewares/protect')

router.route('/')
    .get(iconTypeController.readIconTypes)
    .post(iconTypeController.createIconType)

router.route('/liste/')
    .get(iconTypeController.readIconTypeList)

router.route('/:id')    
    .get(iconTypeController.readIconTypeById)
    .delete(iconTypeController.deleteIconTypeById)
    .put(iconTypeController.updateIconTypeById)

module.exports = router