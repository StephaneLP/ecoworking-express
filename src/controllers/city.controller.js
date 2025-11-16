const city = require('../models/city.model')
const ecoworking = require('../models/ecoworking.model')
const crud = require('./common/crud')
const {trimStringValues} = require('../utils/tools')
const {op} = require('../config/db.params')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readCities = (req, res) => {
    const query = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [city, ['*']],
        joinTables : [[ecoworking, ['id', 'name', 'phone', 'email', 'is_active', 'created_at', 'updated_at']]]
    }

    // FILTRE (WHERE) / Template : [ modèle, colonne, opérateur, [valeurs] (,option : paterne)]
    const queryParams = []
    if(query.id) queryParams.push([city, 'id', op.in, query.id.split(',')])
    if(query.name) queryParams.push([city, 'name', op.like, [query.name], '%?%'])
    if(query.is_active) queryParams.push([city, 'is_active', op.equal, [query.is_active]])

    // TRI (ORDER BY) / Template [modèle, colonne, direction]
    const orderParams = [[city, query.col || 'name', query.dir || 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readCities',
    }

    crud.readRecords(params)(req, res)
}

const readCityList = (req, res) => {
    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [city, ['name']],
        joinTables : []
    }

    // FILTRE (WHERE) / Template : [ modèle, colonne, opérateur, [valeurs] (,option : paterne)]
    const queryParams = [[city, 'is_active', op.equal, ['1']]]
    
    // TRI (ORDER BY) / Template [modèle, colonne, direction]
    const orderParams = [[city, 'rank', 'ASC'], [city, 'name', 'ASC']]

    const params = {
        tables: tables,
        queryParams: queryParams,
        orderParams: orderParams,
        functionName: 'readCityList',
    }

    crud.readRecords(params)(req, res)
}

const readCityById = (req, res) => {
    // TABLES & COLONNES (SELECT FROM) / Template : [ modèle, [colonne1, colonne2, ...]]
    const tables = {
        mainTable: [city, ['name']],
        joinTables : []
    }

    // Paramètre transmis par l'URL (URI Param)
    const URIParam = [city, 'id', op.equal, req.params.id.trim()]

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
    const URIParam = [city, 'id', op.equal, req.params.id.trim()]

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
    const URIParam = [city, 'id', op.equal, req.params.id.trim()]

    const params = {
        table: city,
        URIParam: URIParam,
        functionName: 'deleteCityById',
    }

    crud.deleteRecordById(params)(req, res)
}

module.exports = {readCities, readCityList, readCityById, deleteCityById, createCity, updateCityById}