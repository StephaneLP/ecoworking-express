const db = require('../db/initdb.js')
const cityModel = require('../models/city.model')
const log = require('../utils/log')

/*********************************************************
GET / READ / SELECT
*********************************************************/

const selectAllCities = async (req, res) => {
    const params = {
        columns: 'id, name',
        order: 'name ASC'
    }

    try {
        const dbRes = await cityModel.reqSELECT(params)

        if (!dbRes.success) {
            res.status(500).send('Une erreur est survenue !')
            log.addError(`[cityModel (reqSELECT) - 500] ${dbRes.error}`)
            return
        }

        res.status(200).json(dbRes.rows)
        log.addRequest(`[cityController (selectAllCities) - 200]`)
       
    }
    catch(err) {
        res.status(500).send('Une erreur est survenue !')
        log.addError(`[cityController (selectAllCities) - 500] ${err}`)
    }

}

const selectCityById = async (req, res) => {
    const params = {
        columns: 'id, name, created_at, updated_at',
        filter: ['id', '=', req.params.id],
        order: 'name ASC'
    }

    try {
        const dbRes = await cityModel.reqSELECT(params)

        if (!dbRes.success) {
            res.status(500).send(dbRes.message)
            log.addError(`[cityModel (reqSELECT) - 500] ${dbRes.error}`)
            return
        }

        res.status(200).json(dbRes.rows)
        log.addRequest(`[cityController (selectCityById) - 200]`)
       
    }
    catch(err) {
        res.status(500).send('Une erreur est survenue !')
        log.addError(`[cityController (selectCityById) - 500] ${err}`)
    }

}

module.exports = {selectAllCities, selectCityById}