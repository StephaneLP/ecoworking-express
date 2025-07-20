const express = require('express')
const router = express.Router()
const cityController = require('../controllers/city.controller')
const {authenticate, authorize} = require('../middlewares/protect')

router.route('/')
    .get(cityController.readCities)
    .post(cityController.createCity)

router.route('/:id')    
    .get(authenticate, authorize(['superadmin','admin']), cityController.readCityById)
    // .get(cityController.readCityById)
    .delete(cityController.deleteCityById)
    .put(cityController.updateCityById)

module.exports = router