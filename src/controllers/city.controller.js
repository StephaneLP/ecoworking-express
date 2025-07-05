const {cityTableDef} = require('../models/city.model')
const {trimObjectValues, booleanToNumber} = require('../utils/tools')
const crud = require('./common/crud')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readCities = (req, res) => {
    const query = trimObjectValues(req.query)

    // Clause WHERE : Filtres (conditions)
    const arrParams = []
    if(query.id) arrParams.push({column: 'id', op: 'IN', value: `${query.id}`})
    if(query.name) arrParams.push({column: 'name', op: 'LIKE', value: `${query.name}`, pattern: '%?%'})
    if(query.is_active) arrParams.push({column: 'is_active', op: '=', value: booleanToNumber(query.is_active)})

    // Clause ORDER BY
    let direction = query.dir || ''
    direction = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
    const sort = {column: query.sort || 'name', direction: direction}

    const params = {
        columns: 'id, name',
        queryParams: arrParams,
        order: sort,
        libelles: {
            method: 'readCities',
            fail: 'Aucune ville n\'a été trouvée',
        }
    }

    crud.readRecords(cityTableDef, params)(req, res)
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

    crud.readRecordById(cityTableDef, params)(req, res)
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

    crud.deleteRecordById(cityTableDef, params)(req, res)
}

/*********************************************************
CREATE / POST / INSERT INTO
*********************************************************/

const createCity = (req, res) => {
    const body = trimObjectValues(req.body)

    const params = {
        bodyParams: body,
        libelles: {
            method: 'createCity',
            fail: 'Aucune ville n\'a été créée',
            success: 'La ville a bien été créée',
        }
    }

    crud.createRecord(cityTableDef, params)(req, res)
}

module.exports = {readCities, readCityById, deleteCityById, createCity}