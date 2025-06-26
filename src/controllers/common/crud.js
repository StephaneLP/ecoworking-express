const log = require('../../utils/log')

/*********************************************************
READ
*********************************************************/

const readRecords = (model, params) => {
    return async (req, res) => {
        try {
            const dbReq = await model.sqlSelect(params)

            if (!dbReq.success && dbReq.code == 400) {
                res.status(400).send('Erreur Requête')
                log.addError(`[${params.libelles.method} (sql.js/select) - 400] ${dbReq.error}`)
                return
            }

            if (!dbReq.success && dbReq.code == 500) {
                res.status(500).send('Erreur Serveur')
                log.addError(`[${params.libelles.method} (sql.js/select) - 500] ${dbReq.error}`)
                return
            }

            if (dbReq.rows.length == 0) {
                res.status(404).send(params.libelles.fail)
                log.addError(`[${params.libelles.method} (crud.js/read) - 404] Résultat de la requête : tableau vide`)
                return
            }

            res.status(200).json(dbReq.rows)
            log.addRequest(`[${params.libelles.method} - 200]`)
        
        }
        catch(err) {
            res.status(500).send('Erreur Serveur')
            log.addError(`[${params.libelles.method} (crud.js/read) - 500] ${err}`)
        }
    }
}

const readRecordById = (model, params) => {
    return async (req, res) => {
        try {
            const dbReq = await model.sqlSelectById(params)

            if (!dbReq.success && dbReq.code == 400) {
                res.status(400).send('Erreur Requête')
                log.addError(`[${params.libelles.method} (sql.js/select) - 400] ${dbReq.error}`)
                return
            }

            if (!dbReq.success && dbReq.code == 500) {
                res.status(500).send('Erreur Serveur')
                log.addError(`[${params.libelles.method} (sql.js/select) - 500] ${dbReq.error}`)
                return
            }

            if (dbReq.rows.length == 0) {
                res.status(404).send(params.libelles.fail)
                log.addError(`[${params.libelles.method} (crud.js/read) - 404] Résultat de la requête : tableau vide`)
                return
            }

            res.status(200).json(dbReq.rows)
            log.addRequest(`[${params.libelles.method} - 200]`)
        
        }
        catch(err) {
            res.status(500).send('Erreur Serveur')
            log.addError(`[${params.libelles.method} (crud.js/read) - 500] ${err}`)
        }
    }
}

/*********************************************************
DELETE
*********************************************************/

const deleteRecord = (model, params) => {
    return async (req, res) => {
        try {
            const dbReq = await model.sqlDeleteById(params)

            if (!dbReq.success && dbReq.code == 400) {
                res.status(400).send('Erreur Requête')
                log.addError(`[${params.libelles.method} (sql.js/delete) - 400] ${dbReq.error}`)
                return
            }

            if (!dbReq.success && dbReq.code == 500) {
                res.status(500).send('Erreur Serveur')
                log.addError(`[${params.libelles.method} (sql.js/delete) - 500] ${dbReq.error}`)
                return
            }

            if (dbReq.result.affectedRows === 0) {
                res.status(404).send(params.libelles.fail)
                log.addError(`[${params.libelles.method} (crud.js/read) - 404] Résultat de la requête : pas de ligne supprimée (id : ${params.pathParameter.value})`)
                return
            }

            res.status(200).json(params.libelles.success)
            log.addRequest(`[${params.libelles.method} - 200]`)
        }
        catch(err) {
            res.status(500).send('Erreur Serveur')
            log.addError(`[${params.libelles.method} (crud.js/delete) - 500] ${err}`)            
        }
    }
}

module.exports = {readRecords, readRecordById, deleteRecord}