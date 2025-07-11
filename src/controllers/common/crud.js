const log = require('../../utils/log')
const queries = require('../../models/common/queries')

/*********************************************************
READ
*********************************************************/

const readRecords = (params, tableDef) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQuerySelect(params, tableDef)

            if (!dbReq.success) {
                res.status(400).json({status: 'error', code: 400, message: 'Erreur Requête'})
                log.addError(`Code : 400 ; Fonction : ${params.libelles.method}/${dbReq.method} ; Message : ${dbReq.msg}`)
                return                
            }

            if (dbReq.result.length == 0) {
                res.status(200).json({status: 'success', code: 200, message: params.libelles.fail, data: []})
                log.addError(`Code : 200 ; Fonction : ${params.libelles.method} ; Message : Pas de résultat (tableau vide)`)
                return
            }

            res.status(200).json({status: 'success', code: 200, data: dbReq.result})
            log.addRequest(`Code : 200 ; Fonction : ${params.libelles.method}`)
        }
        catch(err) {
            res.status(500).json({status: 'error', code: 500, message: 'Erreur Serveur'})
            log.addError(`Code : 500 ; Fonction : ${params.libelles.method} ; Message : ${err.message}`)
        }
    }
}

const readRecordById = (params, tableDef) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQuerySelectById(params, tableDef)

            if (!dbReq.success) {
                res.status(400).json({status: 'error', code: 400, message: 'Erreur Requête'})
                log.addError(`Code : 400 ; Fonction : ${params.libelles.method}/${dbReq.method} ; Message : ${dbReq.msg}`)
                return                
            }

            if (dbReq.result.length == 0) {
                res.status(404).json({status: 'error', code: 404, message: params.libelles.fail})
                log.addError(`Code : 404 ; Fonction : ${params.libelles.method} ; Message : Pas de résultat (tableau vide)`)
                return
            }

            res.status(200).json({status: 'success', code: 200, data: dbReq.result})
            log.addRequest(`Code : 200 ; Fonction : ${params.libelles.method}`)
        }
        catch(err) {
            res.status(500).json({status: 'error', code: 500, message: 'Erreur Serveur'})
            log.addError(`Code : 500 ; Fonction : ${params.libelles.method} ; Message : ${err.message}`)
        }
    }
}

/*********************************************************
DELETE
*********************************************************/

const deleteRecordById = (params, tableDef) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQueryDeleteById(params, tableDef)

            if (!dbReq.success) {
                res.status(400).json({status: 'error', code: 400, message: 'Erreur Requête'})
                log.addError(`Code : 400 ; Fonction : ${params.libelles.method}/${dbReq.method} ; Message : ${dbReq.msg}`)
                return
            }

            if (dbReq.result.affectedRows === 0) {
                res.status(404).json({status: 'error', code: 404, message: params.libelles.fail})
                log.addError(`Code : 404 ; Fonction : ${params.libelles.method} ; Message : Aucune ligne supprimée (id: ${params.URIParam.value})`)
                return
            }

            res.status(200).json({status: 'success', code: 200, message: params.libelles.success})
            log.addRequest(`Code : 200 ; Fonction : ${params.libelles.method} ; Message : ${dbReq.result.affectedRows} ligne(s) supprimée(s)`)
        }
        catch(err) {
            res.status(500).json({status: 'error', code: 500, message: 'Erreur Serveur'})
            log.addError(`Code : 500 ; Fonction : ${params.libelles.method} ; Message : ${err.message}`)            
        }
    }
}

/*********************************************************
CREATE
*********************************************************/

const createRecord = (params, tableDef) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQueryInsert(params, tableDef)

            if (!dbReq.success || dbReq.result.affectedRows === 0) {
                res.status(400).json({status: 'error', code: 400, message: 'Erreur Requête'})
                log.addError(`Code : 400 ; Fonction : ${params.libelles.method}/${dbReq.method} ; Message : ${dbReq.msg}`)
                return                
            }

            res.status(200).json({status: 'success', code: 200, message: params.libelles.success})
            log.addRequest(`Code : 200 ; Fonction : ${params.libelles.method} ; Message : ${dbReq.result.affectedRows} ligne(s) ajoutée(s)`)
        }
        catch(err) {
            res.status(500).json({status: 'error', code: 500, message: 'Erreur Serveur'})
            log.addError(`Code : 500 ; Fonction : ${params.libelles.method} ; Message : ${err.message}`)
        }
    }
}

/*********************************************************
UPDATE
*********************************************************/

const updateRecordById = (params, tableDef) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQueryUpdateById(params, tableDef)
console.log(dbReq)
            if (!dbReq.success || dbReq.result.affectedRows === 0) {
                res.status(400).json({status: 'error', code: 400, message: 'Erreur Requête'})
                log.addError(`Code : 400 ; Fonction : ${params.libelles.method}/${dbReq.method} ; Message : ${dbReq.msg}`)
                return                
            }

            res.status(200).json({status: 'success', code: 200, message: params.libelles.success})
            log.addRequest(`Code : 200 ; Fonction : ${params.libelles.method} ; Message : ${dbReq.result.affectedRows} ligne(s) modifée(s)`)
        }
        catch(err) {
            res.status(500).json({status: 'error', code: 500, message: 'Erreur Serveur'})
            log.addError(`Code : 500 ; Fonction : ${params.libelles.method} ; Message : ${err.message}`)
        }
    }
}

module.exports = {readRecords, readRecordById, deleteRecordById, createRecord, updateRecordById}