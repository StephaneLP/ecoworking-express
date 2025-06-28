const log = require('../../utils/log')

/*********************************************************
READ
*********************************************************/

const readRecords = (mode, model, params) => {
    return async (req, res) => {
        let dbReq
        try {
            if (mode === 'all') {
                dbReq = await model.runSelect(params)
            }
            else {
                dbReq = await model.querySelectById(params)
            }

            if (!dbReq.success) {
                res.status(400).send('Erreur Requête')
                log.addError(`Code : 400 ; Fonction : ${params.libelles.method}/${dbReq.method} ; Message : ${dbReq.msg}`)
                return                
            }

            if (dbReq.result.length == 0) {
                res.status(404).send(params.libelles.fail)
                log.addError(`Code : 404 ; Fonction : ${params.libelles.method} ; Message : Pas de résultat (tableau vide)`)
                return
            }

            res.status(200).json(dbReq.result)
            log.addRequest(`Code : 200 ; Fonction : ${params.libelles.method}`)
        }
        catch(err) {
            res.status(500).send('Erreur Serveur')
            log.addError(`Code : 500 ; Fonction : ${params.libelles.method} ; Message : ${err.message}`)
        }
    }
}

/*********************************************************
DELETE
*********************************************************/

const deleteRecord = (model, params) => {
    return async (req, res) => {
        try {
            const dbReq = await model.runDeleteById(params)

            if (!dbReq.success) {
                res.status(400).send('Erreur Requête')
                log.addError(`Code : 400 ; Fonction : ${params.libelles.method}/${dbReq.method} ; Message : ${dbReq.msg}`)
                return                
            }

            if (dbReq.result.affectedRows === 0) {
                res.status(404).send(params.libelles.fail)
                log.addError(`Code : 404 ; Fonction : ${params.libelles.method} ; Message : Aucune ligne supprimée (id : ${params.pathParameter.value})`)
                return
            }

            res.status(200).json(params.libelles.success)
            log.addRequest(`Code : 200 ; Fonction : ${params.libelles.method} ; Message : ${dbReq.result.affectedRows} ligne(s) supprimée(s)`)
        }
        catch(err) {
            res.status(500).send('Erreur Serveur')
            log.addError(`Code : 500 ; Fonction : ${params.libelles.method} ; Message : ${err.message}`)            
        }
    }
}

module.exports = {readRecords, deleteRecord}