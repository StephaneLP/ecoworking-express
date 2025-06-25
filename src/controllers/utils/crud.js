const log = require('../../utils/log')

const select = (model, params) => {
    return async (req, res) => {
        try {
            const dbReq = await model.read(params)

            if (!dbReq.success && dbReq.code == 400) {
                res.status(400).send('Erreur Requête')
                log.addError(`[${params.libelles.method} (sql.js/reqSELECT) - 400] ${dbReq.error}`)
                return
            }

            if (!dbReq.success && dbReq.code == 500) {
                res.status(500).send('Erreur Serveur')
                log.addError(`[${params.libelles.method} (sql.js/reqSELECT) - 500] ${dbReq.error}`)
                return
            }

            if (dbReq.rows.length == 0) {
                res.status(404).send('Aucune ville n\'a été trouvée')
                log.addError(`[${params.libelles.method} (crud.js/select) - 404] Résultat de la requête : tableau vide `)
                return
            }

            res.status(200).json(dbReq.rows)
            log.addRequest(`[${params.libelles.method} - 200]`)
        
        }
        catch(err) {
            res.status(500).send('Erreur Serveur')
            log.addError(`[${params.libelles.method} (crud.js/select) - 500] ${err}`)
        }
    }
}

module.exports = {select}