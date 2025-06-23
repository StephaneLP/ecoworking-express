const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
    console.log('Requête / ROUTE : ECOWORKING - METHOD : ' + req.method)
    next()
})

/*********************************************************
CRUD : Fonctions
*********************************************************/

// READ

const selectAllEcoworkings = (req, res) => {
    res.send('Sélection des ecoworkings')
}

const selectEcoworkingById = (req, res) => {
    const id = req.params.id
    res.send('Sélection de l\'ecoworking id=' + id)
}

/*********************************************************
GET (READ) : Sélection des ecoworkings
*********************************************************/

router.get('/', selectAllEcoworkings)
router.get('/:id', selectEcoworkingById)

module.exports = router