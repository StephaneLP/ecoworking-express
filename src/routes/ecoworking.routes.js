const express = require('express')
const router = express.Router()

const ecoworkingController = require('../controllers/ecoworking.controller')
const {authenticate, authorize} = require('../middlewares/protect')

router.route('/')
    .get(ecoworkingController.readEcoworkings)
    .post(ecoworkingController.createEcoworking)

router.route('/liste/')
    .get(ecoworkingController.readEcoworkingList)

router.route('/:id')    
    .get(ecoworkingController.readEcoworkingById)
    .delete(ecoworkingController.deleteEcoworkingById)
    .put(ecoworkingController.updateEcoworkingById)
module.exports = router