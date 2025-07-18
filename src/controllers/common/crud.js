const {sendResult, sendError} = require('../../utils/result')
const queries = require('../../models/common/queries')

/*********************************************************
READ
*********************************************************/

const readRecords = (params) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQuerySelect(params)

            if (!dbReq.success) {
                return sendError(res, 400, `${params.functionName}/${dbReq.functionName}`, 'Erreur Requête', dbReq.msg)
            }

            sendResult(res, 200, params.functionName, 'Requête exécutée avec succès', dbReq.result.length, dbReq.result)
        }
        catch(err) {
            sendError(res, 500, params.functionName, 'Erreur Serveur', err.message)
        }
    }
}

const readRecordById = (params) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQuerySelectById(params)

            if (!dbReq.success) {
                return sendError(res, 400, `${params.functionName}/${dbReq.functionName}`, 'Erreur Requête', dbReq.msg)               
            }

            if (dbReq.result.length === 0) {
                return sendError(res, 404, params.functionName, 'Aucune ligne n\'a été trouvée', 'La requête a retourné un tableau vide')
            }

            sendResult(res, 200, params.functionName, 'Requête exécutée avec succès', dbReq.result.length, dbReq.result)
        }
        catch(err) {
            sendError(res, 500, params.functionName, 'Erreur Serveur', err.message)
        }
    }
}

/*********************************************************
CREATE
*********************************************************/

const createRecord = (params) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQueryInsert(params)

            if (!dbReq.success) {
                return sendError(res, 400, `${params.functionName}/${dbReq.functionName}`, 'Erreur Requête', dbReq.msg)            
            }

            sendResult(res, 200, params.functionName, `${dbReq.result.affectedRows} ligne(s) créée(s)`, dbReq.result.affectedRows, [])
        }
        catch(err) {
            sendError(res, 500, params.functionName, 'Erreur Serveur', err.message)
        }
    }
}

/*********************************************************
UPDATE
*********************************************************/

const updateRecordById = (params) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQueryUpdateById(params)

            if (!dbReq.success) {
                return sendError(res, 400, `${params.functionName}/${dbReq.functionName}`, 'Erreur Requête', dbReq.msg)              
            }

            if (dbReq.result.affectedRows === 0) {
                return sendError(res, 404, params.functionName, 'Aucune ligne ne correspond à la sélection', `id: ${params.URIParam.value}`)              
            }

            sendResult(res, 200, params.functionName, `${dbReq.result.affectedRows} ligne(s) modifiée(s)`, dbReq.result.affectedRows, [])
        }
        catch(err) {
            sendError(res, 500, params.functionName, 'Erreur Serveur', err.message)
        }
    }
}

/*********************************************************
DELETE
*********************************************************/

const deleteRecordById = (params) => {
    return async (req, res) => {
        try {
            const dbReq = await queries.runQueryDeleteById(params)

            if (!dbReq.success) {
                return sendError(res, 400, `${params.functionName}/${dbReq.functionName}`, 'Erreur Requête', dbReq.msg)
            }

            if (dbReq.result.affectedRows === 0) {
                return sendError(res, 404, params.functionName, 'La ligne n\'a pas pu être supprimée', `id: ${params.URIParam.value}`)
            }

            sendResult(res, 200, params.functionName, `${dbReq.result.affectedRows} ligne(s) supprimée(s)`, dbReq.result.affectedRows, [])
        }
        catch(err) {
            sendError(res, 500, params.functionName, 'Erreur Serveur', err.message)            
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