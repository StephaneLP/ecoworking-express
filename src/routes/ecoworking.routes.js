const express = require('express')
const router = express.Router()

const ecoworkingController = require('../controllers/ecoworking.controller')
const {authenticate, authorize} = require('../middlewares/protect')

router.route('/')
    .get(ecoworkingController.readEcoworking)
    .post(ecoworkingController.createEcoworking)

router.route('/:id')    
    // .get(authenticate, authorize(['superadmin','admin']), ecoworkingController.readCityById)
    .get(ecoworkingController.readEcoworkingById)
    .delete(ecoworkingController.deleteEcoworkingById)
    .put(ecoworkingController.updateEcoworkingById)
module.exports = router