const evaluation = require('../models/evaluation.model')
const user = require('../models/user.model')
const ecoworking = require('../models/ecoworking.model')
const crud = require('./common/crud')
const {trimStringValues} = require('../utils/tools')
const {op} = require('../config/db.params')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readEvaluations = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [evaluation, ['*']],
        joinTables : [[user, ['*']], [ecoworking, ['*']]]
    }

    // FILTRE (WHERE) / Template : [ modèle, colonne, opérateur, [valeurs] (,option : paterne)]
    const queryParams = []
    if(query.id) queryParams.push([evaluation, 'id', op.in, query.id.split(',')])
    if(query.note) queryParams.push([evaluation, 'note', op.in, query.note.split(',')])
    if(query.comment) queryParams.push([evaluation, 'comment', op.like, [query.comment], '%?%'])
    if(query.userid) queryParams.push([evaluation, 'user_id', op.in, [query.userid]])
    if(query.ecoworkingid) queryParams.push([evaluation, 'ecoworking_id', op.in, [query.ecoworkingid]])

    // TRI (ORDER BY) / Template [modèle, colonne, direction]
    const orderParams = [[evaluation, 'ecoworking_id', 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readEvaluations',
    }

    crud.readRecords(params)(req, res)
}

const readEvaluationList = (req, res) => {
    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [evaluation, ['*']],
        joinTables : []
    }

    // FILTRE (WHERE) / Template : [ modèle, colonne, opérateur, [valeurs] (,option : paterne)]
    const queryParams = []
    
    // TRI (ORDER BY) / Template [modèle, colonne, direction]
    const orderParams = [[evaluation, 'ecoworking_id', 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readEvaluationList',
    }

    crud.readRecords(params)(req, res)
}

const readEvaluationById = (req, res) => {
    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [evaluation, ['*']],
        joinTables : []
    }

    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [evaluation, 'id', op.equal, req.params.id.trim()]

    const params = {
        tables: tables,
        URIParam: URIParam,
        functionName: 'readEvaluationById',
    }

    crud.readRecordById(params)(req, res)
}

/*********************************************************
CREATE / POST / INSERT INTO
*********************************************************/

const createEvaluation = (req, res) => {
    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: evaluation,
        bodyParams: body,
        functionName: 'createEvaluation',
    }

    crud.createRecord(params)(req, res)
}

/*********************************************************
UPDATE / PUT / INSERT INTO
*********************************************************/

const updateEvaluationById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [evaluation, 'id', op.equal, req.params.id.trim()]

    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: evaluation,
        URIParam: URIParam,
        bodyParams: body,
        functionName: 'updateEvaluationById',
    }

    crud.updateRecordById(params)(req, res)
}

/*********************************************************
DELETE / DELETE / DELETE
*********************************************************/

const deleteEvaluationById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [evaluation, 'id', op.equal, req.params.id.trim()]

    const params = {
        table: evaluation,
        URIParam: URIParam,
        functionName: 'deleteEvaluationById',
    }

    crud.deleteRecordById(params)(req, res)
}

module.exports = {readEvaluations, readEvaluationList, readEvaluationById, deleteEvaluationById, createEvaluation, updateEvaluationById}