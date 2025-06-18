const db = require('../db/initdb.js')
const cityModel = require('../models/city.model')
const checkParams = require('./checkparams')
const log = require('../utils/log')

/*********************************************************
GET / READ / SELECT
*********************************************************/

const selectAllCity = async (req, res) => {
    const sqlParams = {
        columns: 'id, name',
        order: 'name DESC'
    }

    try {
        const dbRes = await cityModel.selectAll(sqlParams)

        if (dbRes.success) {
            res.status(200).json(dbRes.rows)
        }
        else {
            res.status(500).send('Une erreur est survenue !')
            log.addError(`selectAll - 500 - ${dbRes.err}`)
        }        
    }
    catch(err) {
        res.status(500).send('Une erreur est survenue !')
        log.addError(`selectAllCity - 500 - ${err}`)
    }
}

const selectCityById = async (req, res) => {
    const params = {
        param: ['id', req.params.id],
        columns: 'id, name',
        order: 'name DESC'
    }



    // Paramètres
    const objDatas = {id: req.params.id}

    // 


    checkParams(cityModel.model, objDatas)

    const objSql = {
        columns: 'id, name, created_at, updated_at',
        tables: 'city',
        filter: 'id=?',
    }

    const arrParams = [objDatas.id] // ! Même ordre que les '?' de la clause WHERE
    const reqSQL = `SELECT ${objSql.columns} FROM ${objSql.tables} WHERE ${objSql.filter}`






    try {
        const row = await db.conn.query(reqSQL, arrParams)
        if (row.length === 0) {
            res.status(404).send('Aucune ville n\'a été trouvée !')
            log.addError(`selectCityById - 404 - Aucune ville n'a été trouvée pour l'id : ${objDatas.id}`)
            return
        }
        res.status(200).send(row)
    }
    catch(err) {
        res.status(500).send('Une erreur est survenue !')
        log.addError(`selectCityById - 500 - ${err}`)
    }
}

module.exports = {selectAllCity, selectCityById}