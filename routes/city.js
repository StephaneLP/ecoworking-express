const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
    console.log('Requête route CITY')
    next()
})

/*********************************************************
CRUD : Fonctions
*********************************************************/

// READ

const selectAllCity = (req, res) => {
    res.send('Sélection de toutes les villes')
}

const selectCityById = (req, res) => {
    const id = req.params.id
    res.send('Sélection de la ville id=' + id)
}

/*********************************************************
GET (READ) : Sélection des villes
*********************************************************/

router.get('/', selectAllCity)
router.get('/:id', selectCityById)

module.exports = router