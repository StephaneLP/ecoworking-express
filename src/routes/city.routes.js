const express = require('express')
const router = express.Router()
const cityController = require('../controllers/city.controller')

router.route('/')
    .get(cityController.readCities)
    .post(cityController.createCity)

router.route('/:id')    
    .get(cityController.readCityById)
    .delete(cityController.deleteCityById)
    .put(cityController.updateCityById)

module.exports = router