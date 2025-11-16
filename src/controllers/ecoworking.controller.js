const ecoworking = require('../models/ecoworking.model')
const city = require('../models/city.model')
const crud = require('./common/crud')
const {trimStringValues} = require('../utils/tools')
const {op} = require('../config/db.params')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readEcoworking = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT...FROM...)
    const tables = {
        mainTable: [ecoworking, ['id', 'name', 'phone', 'email', 'is_active', 'created_at', 'updated_at']],
        joinTables : [[city, ['id', 'name']]]
    }

    // FILTRE (clause WHERE)
    const queryParams = []
    if(query.id) queryParams.push([ecoworking, 'id', op.in, query.id.split(',')])
    if(query.name) queryParams.push([ecoworking, 'name', op.like, [query.name], '%?%'])
    if(query.is_active) queryParams.push([ecoworking, 'is_active', op.equal, [query.is_active]])
    if(query.city) queryParams.push([city, 'name', op.like, [query.city], '%?%'])

    // TRI (clause ORDER BY)
    const orderParams = [[ecoworking, query.sort || 'name', query.dir || 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readEcoworking',
    }

    crud.readRecords(params)(req, res)
}

const readEcoworkingById = (req, res) => {
    // TABLES & COLONNES (SELECT...FROM...)
    const tables = {
        mainTable: [ecoworking, ['id', 'name', 'phone', 'email', 'is_active', 'created_at', 'updated_at']],
        joinTables : [[city, ['id', 'name']]]
    }

    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [ecoworking, 'id', op.equal, req.params.id.trim()]

    const params = {
        tables: tables,
        URIParam: URIParam,
        functionName: 'readEcoworkingById',
    }

    crud.readRecordById(params)(req, res)
}

/*********************************************************
CREATE / POST / INSERT INTO
*********************************************************/

const createEcoworking = (req, res) => {
    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: ecoworking,
        bodyParams: body,
        functionName: 'createEcoworking',
    }

    crud.createRecord(params)(req, res)
}

/*********************************************************
UPDATE / PUT / INSERT INTO
*********************************************************/

const updateEcoworkingById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [ecoworking, 'id', op.equal, req.params.id.trim()]

    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)
    
    const params = {
        table: ecoworking,
        URIParam: URIParam,
        bodyParams: body,
        functionName: 'updateEcoworkingById',
    }

    crud.updateRecordById(params)(req, res)
}

/*********************************************************
DELETE / DELETE / DELETE
*********************************************************/

const deleteEcoworkingById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [ecoworking, 'id', op.equal, req.params.id.trim()]

    const params = {
        table: ecoworking,
        URIParam: URIParam,
        functionName: 'deleteEcoworkingById',
    }

    crud.deleteRecordById(params)(req, res)
}

module.exports = {readEcoworking, readEcoworkingById, deleteEcoworkingById, createEcoworking, updateEcoworkingById}