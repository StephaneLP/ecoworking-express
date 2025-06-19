const db = require('../db/initdb.js')
const cityModel = require('../models/city.model')
const log = require('../utils/log')

/*********************************************************
GET / READ / SELECT
*********************************************************/

async function sqlSelect(res, params) {
    try {
        const dbRes = await cityModel.reqSELECT(params)

        if (!dbRes.success) {
            res.status(dbRes.code).send(dbRes.message)
            log.addError(`[cityModel.reqSELECT - ${dbRes.code}] ${dbRes.error}`)
            return
        }

        res.status(200).json(dbRes.rows)
        log.addRequest(`[cityController.sqlSelect - 200]`)
       
    }
    catch(err) {
        res.status(500).send('Une erreur est survenue !')
        log.addError(`[cityController.sqlSelect - 500] ${err}`)
    }
}

const selectAllCities = (req, res) => {
    const params = {
        columns: 'id, name',
        order: 'name ASC'
    }

    sqlSelect(res, params)
}

const selectCityById = (req, res) => {
    const params = {
        columns: 'id, name, created_at, updated_at',
        // filter: ['name', 'LIKE', '%ou%'],
        filter: ['id', '=', req.params.id],
        order: 'name ASC'
    }

    sqlSelect(res, params)
}

module.exports = {selectAllCities, selectCityById}