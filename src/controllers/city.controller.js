const db = require('../db/initdb.js')
const log = require('../utils/log')

/*********************************************************
GET / READ / SELECT
*********************************************************/

const selectAllCity = async (req, res) => {
    try {
        const rows = await db.conn.query('SELECT id, name FROM city')
        res.status(200).json(rows)
    }
    catch(err) {
        res.status(500).send('Une erreur est survenue !')
         log.addError(`selectAllCity - 500 - ${err}`)
    }
}

const selectCityById = async (req, res) => {
    const id = req.params.id
    try {
        const row = await db.conn.query('SELECT id, name FROM city WHERE id=' + id)
        if (row.length === 0) {
            res.status(404).send('Aucune ville n\'a été trouvée !')
            log.addError(`selectCityById - 404 - Aucune ville n'a été trouvée pour l'id : ${id}`)
            return
        }
        res.status(200).send(row[0].name)
    }
    catch(err) {
        res.status(500).send('Une erreur est survenue !')
        log.addError(`selectCityById - 500 - ${err}`)
    }
}

module.exports = {selectAllCity, selectCityById}