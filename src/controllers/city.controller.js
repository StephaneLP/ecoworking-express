const {cityTableDef} = require('../models/city.model')
const {trimStringValues} = require('../utils/tools')
const crud = require('./common/crud')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readCities = (req, res) => {
    const queryParams = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT...FROM...)
    const arrTables = ['city']
    const arrColumns = [{
        tableDef: cityTableDef,
        columns: ['name', 'is_active', 'created_at', 'updated_at']
    }]

    // FILTRE (clause WHERE)
    const arrQueryParams = []
    if(queryParams.id) arrQueryParams.push({tableDef: cityTableDef, column: 'id', op: 'IN', values: queryParams.id.split(',')})
    if(queryParams.name) arrQueryParams.push({tableDef: cityTableDef, column: 'name', op: 'LIKE', values: [queryParams.name], pattern: '%?%'})
    if(queryParams.is_active) arrQueryParams.push({tableDef: cityTableDef, column: 'is_active', op: '=', values: [queryParams.is_active]})

    // TRI (clause ORDER BY)
    const col = queryParams.sort || 'name'
    const dir = queryParams.dir || 'ASC'
    const arrOrder = [{tableDef: cityTableDef, column: col, direction: dir}]

    const params = {
        tables: arrTables,
        columns: arrColumns,
        queryParams: arrQueryParams,
        order: arrOrder,
        dateFormat: '%Y-%m-%d %H:%i:%s',
        functionName: 'readCities',
    }

    crud.readRecords(params)(req, res)
}

const readCityById = (req, res) => {
    // TABLES & COLONNES (SELECT...FROM...)
    const arrTables = ['city']
    const arrColumns = [{
        tableDef: cityTableDef,
        columns: ['name', 'is_active', 'created_at', 'updated_at']
    }]

    const params = {
        tables: arrTables,
        columns: arrColumns,
        URIParam: {tableDef: cityTableDef, column: 'id', op: '=', value: req.params.id.trim()},
        dateFormat: '%Y-%m-%d %H:%i:%s',
        functionName: 'readCityById',
    }

    crud.readRecordById(params)(req, res)
}

/*********************************************************
CREATE / POST / INSERT INTO
*********************************************************/

const createCity = (req, res) => {
    const body = trimStringValues(req.body)

    const params = {
        tableDef: cityTableDef,
        bodyParams: body,
        functionName: 'createCity',
    }

    crud.createRecord(params)(req, res)
}

/*********************************************************
UPDATE / PUT / INSERT INTO
*********************************************************/

const updateCityById = (req, res) => {
    const body = trimStringValues(req.body)

    const params = {
        tableDef: cityTableDef,
        URIParam: {column: 'id', op: '=', value: req.params.id.trim()},
        bodyParams: body,
        functionName: 'updateCityById',
    }

    crud.updateRecordById(params)(req, res)
}

/*********************************************************
DELETE / DELETE / DELETE
*********************************************************/

const deleteCityById = (req, res) => {
    const params = {
        tableDef: cityTableDef,
        URIParam: {column: 'id', op: '=', value: req.params.id.trim()},
        functionName: 'deleteCityById',
    }

    crud.deleteRecordById(params)(req, res)
}

module.exports = {readCities, readCityById, deleteCityById, createCity, updateCityById}