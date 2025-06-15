const express = require('express')
const router = express.Router()
const db = require('../db/initdb.js')
const log = require('../utils/log.js')

/*********************************************************
CRUD : Fonctions
*********************************************************/

// READ

const selectAllCity = async (req, res) => {
    try {
        const rows = await db.conn.query('SELECT id, name FROM city')
        res.status(200).json(rows)
    }
    catch(err) {
        res.status(500).send('Une erreur est survenue ! Code : ' + err)
        log('Une erreur est survenue ! Code : ' + err)
    }
}

const selectCityById = async (req, res) => {
    const id = req.params.id
    try {
        const row = await db.conn.query('SELECT id, name FROM city WHERE id=' + id)
        if (row.length === 0) {
            res.status(404).send('Aucune ville n\'a été trouvée pour l\'id : ' + id)
            log('Aucune ville n\'a été trouvée pour l\'id : ' + id)
            return
        }
        res.status(200).send(row[0].name)
    }
    catch(err) {
        res.status(500).send('Une erreur est survenue ! Code : ' + err)
        log('Une erreur est survenue ! Code : ' + err)
    }
}

/*********************************************************
GET (READ) : Sélection des villes
*********************************************************/

router.get('/', selectAllCity)
router.get('/:id', selectCityById)

module.exports = router