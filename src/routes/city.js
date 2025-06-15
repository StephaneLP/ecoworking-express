const express = require('express')
const router = express.Router()
const cityController = require('../controllers/city.controller')

router.get('/', cityController.selectAllCity)
router.get('/:id', cityController.selectCityById)

module.exports = router