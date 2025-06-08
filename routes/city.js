const express = require('express')
const router = express.Router()
const conn = require('../db/initdb')

router.use((req, res, next) => {
    console.log('Requête / ROUTE : VILLE - METHOD : ' + req.method)
    next()
})

/*********************************************************
CRUD : Fonctions
*********************************************************/

// READ

const selectAllCity = async (req, res) => {

        
        console.log("STOP")
        const rows = await conn.query('SELECT id FROM city');
        console.log(rows)



    res.send('Sélection des villes')
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