const {city} = require('../models/city.model')
const crud = require('./common/crud')
const {trimStringValues} = require('../utils/tools')
const {op} = require('../config/db.params')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readCities = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT...FROM...)
    const tables = {
        mainTable: {
            model: city,
            columns: ['id', 'name', 'is_active', 'created_at', 'updated_at']
        },
        joinTables : []
    }

    // FILTRE (clause WHERE)
    const queryParams = []
    
    if(query.id) queryParams.push({
        model: city, 
        column: 'id', 
        op: op.in, 
        values: query.id.split(',')})

    if(query.name) queryParams.push({
        model: city, 
        column: 'name', 
        op: op.like, 
        values: [query.name], pattern: '%?%'})

    if(query.is_active) queryParams.push({
        model: city, 
        column: 'is_active', 
        op: op.equal, 
        values: [query.is_active]})

    // TRI (clause ORDER BY)
    const orderParams = [
        {model: city, column: query.sort || 'name', direction: query.dir || 'ASC'}
    ]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readCities',
    }

    crud.readRecords(params)(req, res)
}

const readCityById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = {model: city, column: 'id', op: op.equal, value: req.params.id.trim()}

    // TABLES & COLONNES (SELECT...FROM...)
    const tables = {
        mainTable: {
            model: city,
            columns: ['*']
        },
        joinTables : []
    }

    const params = {
        tables: tables,
        URIParam: URIParam,
        functionName: 'readCityById',
    }

    crud.readRecordById(params)(req, res)
}

/*********************************************************
CREATE / POST / INSERT INTO
*********************************************************/

const createCity = (req, res) => {
    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: city,
        bodyParams: body,
        functionName: 'createCity',
    }

    crud.createRecord(params)(req, res)
}

/*********************************************************
UPDATE / PUT / INSERT INTO
*********************************************************/

const updateCityById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = {model: city, column: 'id', op: op.equal, value: req.params.id.trim()}

    // Données transmises dans le corps de la requête
    const body = trimStringValues(req.body)

    const params = {
        table: city,
        URIParam: URIParam,
        bodyParams: body,
        functionName: 'updateCityById',
    }

    crud.updateRecordById(params)(req, res)
}

/*********************************************************
DELETE / DELETE / DELETE
*********************************************************/

const deleteCityById = (req, res) => {
    // Paramètre transmis par l'URL (URI Param)
    const URIParam = {model: city, column: 'id', op: op.equal, value: req.params.id.trim()}

    const params = {
        table: city,
        URIParam: URIParam,
        functionName: 'deleteCityById',
    }

    crud.deleteRecordById(params)(req, res)
}

module.exports = {readCities, readCityById, deleteCityById, createCity, updateCityById}