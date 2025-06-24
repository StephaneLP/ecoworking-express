const db = require('../config/db.js')
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
        const dbReq = await cityModel.reqSELECT(params)

        if (!dbReq.success) {
            res.status(500).send('Erreur Serveur')
            log.addError(`[cityModel (reqSELECT) - 500] ${dbReq.error}`)
            return
        }

        if (dbReq.rows.length == 0) {
            res.status(404).send('Aucune ville n\'a été trouvée')
            log.addError(`[cityController (selectAllCities) - 404] Résultat de la requête : tableau vide `)
            return
        }

        res.status(200).json(dbReq.rows)
        log.addRequest(`[cityController (selectAllCities) - 200]`)
       
    }
    catch(err) {
        res.status(500).send('Erreur Serveur')
        log.addError(`[cityController (selectAllCities) - 500] ${err}`)
    }

}

const selectCityById = async (req, res) => {
    const params = {
        columns: 'id, name, is_active, created_at, updated_at',
        filter: [{name: 'id', op: '=', value: req.params.id.trim()}],
        order: 'name ASC'
    }

    try {
        const dbReq = await cityModel.reqSELECT(params)

        if (!dbReq.success && dbReq.code == 400) {
            res.status(500).send('Erreur Requête')
            log.addError(`[cityModel (reqSELECT) - 400] ${dbReq.error}`)
            return
        }

        if (!dbReq.success && dbReq.code == 500) {
            res.status(500).send('Erreur Serveur')
            log.addError(`[cityModel (reqSELECT) - 500] ${dbReq.error}`)
            return
        }

        if (dbReq.rows.length == 0) {
            res.status(404).send('Aucune ville n\'a été trouvée')
            log.addError(`[cityController (selectAllCities) - 404] Résultat de la requête : tableau vide `)
            return
        }

        res.status(200).json(dbReq.rows)
        log.addRequest(`[cityController (selectCityById) - 200]`)
    }
    catch(err) {
        res.status(500).send('Erreur Serveur')
        log.addError(`[cityController (selectCityById) - 500] ${err}`)
    }
}


const selectAddCities = async (req, res) => {
    const params = {
        // columns: 'id, name',
        order: 'name ASC'
    }

    try {
        const dbReq = await cityModel.reqINSERT(params)

        if (!dbReq.success) {
            res.status(500).send('Erreur Serveur')
            log.addError(`[cityModel (reqSELECT) - 500] ${dbReq.error}`)
            return
        }

        if (dbReq.rows.length == 0) {
            res.status(404).send('Aucune ville n\'a été trouvée')
            log.addError(`[cityController (selectAllCities) - 404] Résultat de la requête : tableau vide `)
            return
        }

        res.status(200).json(dbReq.rows)
        log.addRequest(`[cityController (selectAllCities) - 200]`)
       
    }
    catch(err) {
        res.status(500).send('Erreur Serveur')
        log.addError(`[cityController (selectAllCities) - 500] ${err}`)
    }

}

module.exports = {selectAllCities, selectCityById, selectAddCities}