const {cityTableDef} = require('../models/city.model')
const {trimStringValues, booleanToNumber} = require('../utils/tools')
const crud = require('./common/crud')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readCities = (req, res) => {
    const queryParams = trimStringValues(req.query)

    // Clause WHERE : tableau contenant les filtres (objets)
    const arrQueryParams = []
    if(queryParams.id) arrQueryParams.push({column: 'id', op: 'IN', value: queryParams.id.split(',')})
    if(queryParams.name) arrQueryParams.push({column: 'name', op: 'LIKE', value: queryParams.name, pattern: '%?%'})
    if(queryParams.is_active) arrQueryParams.push({column: 'is_active', op: '=', value: queryParams.is_active})

    const params = {
        columns: 'id, name, is_active',
        queryParams: arrQueryParams,
        order: {column: queryParams.sort || 'name', direction: queryParams.dir || 'ASC'},
        libelles: {
            method: 'readCities',
            fail: 'Aucune ville n\'a été trouvée',
        }
    }

    crud.readRecords(params, cityTableDef)(req, res)
}

const readCityById = (req, res) => {
    const params = {
        columns: 'id, name, created_at, updated_at',
        URIParam: {column: 'id', op: '=', value: req.params.id.trim()},
        libelles: {
            method: 'readCityById',
            fail: 'Aucune ville n\'a été trouvée',
        }
    }

    crud.readRecordById(params, cityTableDef)(req, res)
}

/*********************************************************
DELETE / DELETE / DELETE
*********************************************************/

const deleteCityById = (req, res) => {
    const params = {
        URIParam: {column: 'id', op: '=', value: req.params.id.trim()},
        libelles: {
            method: 'deleteCityById',
            fail: 'Aucune ville n\'a été supprimée',
            success: 'La ville a bien été supprimée',
        }
    }

    crud.deleteRecordById(params, cityTableDef)(req, res)
}

/*********************************************************
CREATE / POST / INSERT INTO
*********************************************************/

const createCity = (req, res) => {
    const body = trimStringValues(req.body)

    const params = {
        bodyParams: body,
        libelles: {
            method: 'createCity',
            fail: 'Aucune ville n\'a été créée',
            success: 'La ville a bien été créée',
        }
    }

    crud.createRecord(params, cityTableDef)(req, res)
}

module.exports = {readCities, readCityById, deleteCityById, createCity}