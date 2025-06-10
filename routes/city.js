const express = require('express')
const router = express.Router()
const db = require('../db/initdb').objConn

/*********************************************************
CRUD : Fonctions
*********************************************************/

// READ

const selectAllCity = async (req, res) => {
    const rows = await db.connexion.query('SELECT id, name FROM city')
    res.json(rows)
}

const selectCityById = async (req, res) => {
    const id = req.params.id
    try {
        const row = await db.connexion.query('SELECT id, name FROM city WHERE id=' + id)
        if (row.length === 0) {
            res.status(404).send('Aucune ville n\'a été trouvée pour l\'id : ' + id)
            return
        }

        res.send(row[0].name)
    }
    catch(err) {
        res.status(500).send('Une erreur est survenue ! Code : ' + err)
    }
}

/*********************************************************
GET (READ) : Sélection des villes
*********************************************************/

router.get('/', selectAllCity)
router.get('/:id', selectCityById)

module.exports = router