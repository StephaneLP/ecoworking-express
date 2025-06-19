const express = require('express')
const router = express.Router()
const cityController = require('../controllers/city.controller')

router.get('/', cityController.selectAllCities)
router.get('/:id', cityController.selectCityById)

module.exports = router