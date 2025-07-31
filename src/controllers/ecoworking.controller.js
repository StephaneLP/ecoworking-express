const {ecoworking} = require('../models/ecoworking.model')
const {city} = require('../models/city.model')
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
        mainTable: {
            model: ecoworking,
            columns: ['id', 'name', 'phone', 'email', 'is_active', 'created_at', 'updated_at']
        },
        joinTables : [{
            model: city,
            columns: ['name', 'is_active']
        }]
    }

    // FILTRE (clause WHERE)
    const queryParams = []
    
    if(query.id) queryParams.push({
        model: ecoworking, 
        column: 'id', 
        op: op.in, 
        values: query.id.split(',')})

    if(query.name) queryParams.push({
        model: ecoworking, 
        column: 'name', 
        op: op.like, 
        values: [query.name], pattern: '%?%'})

    if(query.is_active) queryParams.push({
        model: ecoworking, 
        column: 'is_active', 
        op: op.equal, 
        values: [query.is_active]})

    if(query.city) queryParams.push({
        model: city, 
        column: 'name', 
        op: op.like, 
        values: [query.city], pattern: '%?%'})

    // TRI (clause ORDER BY)
    const orderParams = [
        {model: ecoworking, column: query.sort || 'name', direction: query.dir || 'ASC'}
    ]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readEcoworking',
    }

    crud.readRecords(params)(req, res)
}

const readEcoworkingById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = {model: ecoworking, column: 'id', op: op.equal, value: req.params.id.trim()}

    // TABLES & COLONNES (SELECT...FROM...)
    const tables = {
        mainTable: {
            model: ecoworking,
            columns: ['id', 'name', 'phone', 'email', 'is_active', 'created_at', 'updated_at']
        },
        joinTables : [{
            model: city,
            columns: ['name', 'is_active']
        }]
    }

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
    const URIParam = {model: ecoworking, column: 'id', op: op.equal, value: req.params.id.trim()}

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
    const URIParam = {model: ecoworking, column: 'id', op: op.equal, value: req.params.id.trim()}

    const params = {
        table: ecoworking,
        URIParam: URIParam,
        functionName: 'deleteEcoworkingById',
    }

    crud.deleteRecordById(params)(req, res)
}

module.exports = {readEcoworking, readEcoworkingById, deleteEcoworkingById, createEcoworking, updateEcoworkingById}