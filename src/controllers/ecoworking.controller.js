const {ecoworkingTableDef} = require('../models/ecoworking.model')
const {cityTableDef} = require('../models/city.model')
const {trimStringValues} = require('../utils/tools')
const crud = require('./common/crud')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readEcoworking = (req, res) => {
    const queryParams = trimStringValues(req.query)

    // TABLES & COLONNES (SELECT...FROM...)
    const arrTables = ['city', ['ecoworking', 'ecoworking.city_id = city.id']]
    // const arrTables = ['ecoworking', ['city', 'ecoworking.city_id = city.id']]
    const arrColumns = [
        {
            tableDef: ecoworkingTableDef,
            columns: ['id', 'name', 'phone', 'email', 'is_active', 'created_at', 'updated_at']
        },
        {
            tableDef: cityTableDef,
            columns: ['name', 'is_active']
        }
    ]

    // FILTRE (clause WHERE)
    const arrQueryParams = []
    if(queryParams.id) arrQueryParams.push({tableDef: ecoworkingTableDef, column: 'id', op: 'IN', values: queryParams.id.split(',')})
    if(queryParams.name) arrQueryParams.push({tableDef: ecoworkingTableDef, column: 'name', op: 'LIKE', values: [queryParams.name], pattern: '%?%'})
    if(queryParams.is_active) arrQueryParams.push({tableDef: ecoworkingTableDef, column: 'is_active', op: '=', values: [queryParams.is_active]})
    if(queryParams.city) arrQueryParams.push({tableDef: cityTableDef, column: 'name', op: 'LIKE', values: [queryParams.city], pattern: '%?%'})

    // TRI (clause ORDER BY)
    const col = queryParams.sort || 'name'
    const dir = queryParams.dir || 'ASC'
    const arrOrder = [{tableDef: cityTableDef, column: col, direction: dir}]
    // const arrOrder = [{tableDef: ecoworkingTableDef, column: col, direction: dir}]

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

const readEcoworkingById = (req, res) => {
    // TABLES & COLONNES (SELECT...FROM...)
    const arrTables = ['ecoworking']
    const arrColumns = [{
        tableDef: ecoworkingTableDef,
        columns: ['name', 'is_active', 'created_at', 'updated_at']
    }]

    const params = {
        tables: arrTables,
        columns: arrColumns,
        URIParam: {tableDef: ecoworkingTableDef, column: 'id', op: '=', value: req.params.id.trim()},
        dateFormat: '%Y-%m-%d %H:%i:%s',
        functionName: 'readecoworkingById',
    }

    crud.readRecordById(params)(req, res)
}

/*********************************************************
CREATE / POST / INSERT INTO
*********************************************************/

const createEcoworking = (req, res) => {
    const body = trimStringValues(req.body)

    const params = {
        tableDef: ecoworkingTableDef,
        bodyParams: body,
        functionName: 'createEcoworking',
    }

    crud.createRecord(params)(req, res)
}

/*********************************************************
UPDATE / PUT / INSERT INTO
*********************************************************/

const updateEcoworkingById = (req, res) => {
    const body = trimStringValues(req.body)

    const params = {
        tableDef: ecoworkingTableDef,
        URIParam: {column: 'id', op: '=', value: req.params.id.trim()},
        bodyParams: body,
        functionName: 'updateEcoworkingById',
    }

    crud.updateRecordById(params)(req, res)
}

/*********************************************************
DELETE / DELETE / DELETE
*********************************************************/

const deleteEcoworkingById = (req, res) => {
    const params = {
        tableDef: ecoworkingTableDef,
        URIParam: {column: 'id', op: '=', value: req.params.id.trim()},
        functionName: 'deleteEcoworkingById',
    }

    crud.deleteRecordById(params)(req, res)
}

module.exports = {readEcoworking, readEcoworkingById, deleteEcoworkingById, createEcoworking, updateEcoworkingById}