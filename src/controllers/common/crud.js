const {sendResult, sendError} = require('../../utils/result')
const queries = require('../../models/common/queries')

/*********************************************************
READ
*********************************************************/

const readRecords = (params, tableDef) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQuerySelect(params, tableDef)

            if (!dbReq.success) {
                return sendError(res, 400, `${params.libelles.method}/${dbReq.method}`, 'Erreur Requête', 'dbReq.msg')
            }

            sendResult(res, 200, params.libelles.method, '', dbReq.result.length, dbReq.result)
        }
        catch(err) {
            sendError(res, 500, params.libelles.method, 'Erreur Serveur', err.message)
        }
    }
}

const readRecordById = (params, tableDef) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQuerySelectById(params, tableDef)

            if (!dbReq.success) {
                return sendError(res, 400, `${params.libelles.method}/${dbReq.method}`, 'Erreur Requête', dbReq.msg)               
            }

            if (dbReq.result.length === 0) {
                return sendError(res, 404, params.libelles.method, params.libelles.fail, 'Pas de résultat (tableau vide)')
            }

            sendResult(res, 200, params.libelles.method, '', dbReq.result.length, dbReq.result)
        }
        catch(err) {
            sendError(res, 500, params.libelles.method, 'Erreur Serveur', err.message)
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
                return sendError(res, 400, `${params.libelles.method}/${dbReq.method}`, 'Erreur Requête', dbReq.msg)
            }

            if (dbReq.result.affectedRows === 0) {
                return sendError(res, 404, params.libelles.method, params.libelles.fail, `La ligne n'a pas été supprimée (id: ${params.URIParam.value})`)
            }

            res.status(200).json({status: 'success', code: 200, message: params.libelles.success})
            log.addRequest(`Code : 200 ; Fonction : ${params.libelles.method} ; Message : ${dbReq.result.affectedRows} ligne(s) supprimée(s)`)
        }
        catch(err) {
            sendError(res, 500, params.libelles.method, 'Erreur Serveur', err.message)            
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

            if (!dbReq.success) {
                return sendError(res, 400, `${params.libelles.method}/${dbReq.method}`, 'Erreur Requête', dbReq.msg)            
            }

            res.status(200).json({status: 'success', code: 200, message: params.libelles.success})
            log.addRequest(`Code : 200 ; Fonction : ${params.libelles.method} ; Message : ${dbReq.result.affectedRows} ligne(s) ajoutée(s)`)
        }
        catch(err) {
            sendError(res, 500, params.libelles.method, 'Erreur Serveur', err.message)
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

            if (!dbReq.success) {
                return sendError(res, 400, `${params.libelles.method}/${dbReq.method}`, 'Erreur Requête', dbReq.msg)              
            }

            if (dbReq.result.affectedRows === 0) {
                return sendError(res, 404, params.libelles.method, 'Auncune ligne ne correspond à la sélection', 'Auncune ligne ne correspond à la sélection')              
            }

            res.status(200).json({status: 'success', code: 200, message: params.libelles.success})
            log.addRequest(`Code : 200 ; Fonction : ${params.libelles.method} ; Message : ${dbReq.result.affectedRows} ligne(s) modifée(s)`)
        }
        catch(err) {
            sendError(res, 500, params.libelles.method, 'Erreur Serveur', err.message)
        }
    }
}

/*********************************************************
REQUÊTES INTERNES
*********************************************************/

const getRecordByParams = async (params, tableDef) => {
    try {
        return await queries.runGetRecordByParams(params, tableDef)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }
}

module.exports = {readRecords, readRecordById, deleteRecordById, createRecord, updateRecordById, getRecordByParams}