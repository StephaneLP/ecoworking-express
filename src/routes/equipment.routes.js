const express = require('express')
const router = express.Router()
const equipmentController = require('../controllers/equipment.controller')
const {authenticate, authorize} = require('../middlewares/protect')

router.route('/')
    .get(equipmentController.readEquipments)
    .post(equipmentController.createEquipment)

router.route('/liste/')
    .get(equipmentController.readEquipmentList)

router.route('/:id')    
    .get(equipmentController.readEquipmentById)
    .delete(equipmentController.deleteEquipmentById)
    .put(equipmentController.updateEquipmentById)

module.exports = router