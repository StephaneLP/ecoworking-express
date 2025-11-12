const queries = require('../../models/common/runQueries')
const {sendResult, sendError, formatResponse} = require('./result')

/*********************************************************
READ
*********************************************************/

const readRecords = (params) => {
    return async (req, res) => {
        try {
            const dbRes = await queries.runQuerySelect(params)

            if (!dbRes.success) {
                return sendError(res, 400, `${params.functionName}/${dbRes.functionName}`, 'Erreur Requête', dbRes.msg)
            }

            const formatDbRes = Number(process.env.DB_RES_NEST_FORMAT) ? formatResponse(params, dbRes.result) : dbRes.result
            sendResult(res, 200, params.functionName, 'Requête exécutée avec succès', dbRes.result.length, formatDbRes)
        }
        catch(err) {
            sendError(res, 500, params.functionName, 'Erreur Serveur', err.message)
        }
    }
}

const readRecordById = (params) => {
    return async (req, res) => {
        try {
            const dbRes = await queries.runQuerySelectById(params)

            if (!dbRes.success) {
                return sendError(res, 400, `${params.functionName}/${dbRes.functionName}`, 'Erreur Requête', dbRes.msg)               
            }

            if (dbRes.result.length === 0) {
                return sendError(res, 404, params.functionName, 'Aucune ligne n\'a été trouvée', 'La requête a retourné un tableau vide')
            }

            const formatDbRes = Number(process.env.DB_RES_FORMAT_NATIVE) ? dbRes.result : formatResponse(params, dbRes.result)
            sendResult(res, 200, params.functionName, 'Requête exécutée avec succès', dbRes.result.length, formatDbRes)
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
            const dbRes = await queries.runQueryInsert(params)

            if (!dbRes.success) {
                return sendError(res, 400, `${params.functionName}/${dbRes.functionName}`, 'Erreur Requête', dbRes.msg)            
            }

            sendResult(res, 200, params.functionName, `${dbRes.result.affectedRows} ligne(s) créée(s)`, dbRes.result.affectedRows, [])
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
            const dbRes = await queries.runQueryUpdateById(params)

            if (!dbRes.success) {
                return sendError(res, 400, `${params.functionName}/${dbRes.functionName}`, 'Erreur Requête', dbRes.msg)              
            }

            if (dbRes.result.affectedRows === 0) {
                return sendError(res, 404, params.functionName, 'Aucune ligne ne correspond à la sélection', `id: ${params.URIParam.value}`)              
            }

            sendResult(res, 200, params.functionName, `${dbRes.result.affectedRows} ligne(s) modifiée(s)`, dbRes.result.affectedRows, [])
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
            const dbRes = await queries.runQueryDeleteById(params)

            if (!dbRes.success) {
                return sendError(res, 400, `${params.functionName}/${dbRes.functionName}`, 'Erreur Requête', dbRes.msg)
            }

            if (dbRes.result.affectedRows === 0) {
                return sendError(res, 404, params.functionName, 'La ligne n\'a pas pu être supprimée', `id: ${params.URIParam.value}`)
            }

            sendResult(res, 200, params.functionName, `${dbRes.result.affectedRows} ligne(s) supprimée(s)`, dbRes.result.affectedRows, [])
        }
        catch(err) {
            sendError(res, 500, params.functionName, 'Erreur Serveur', err.message)            
        }
    }
}

module.exports = {readRecords, readRecordById, deleteRecordById, createRecord, updateRecordById}