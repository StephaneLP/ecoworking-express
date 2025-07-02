const {cityTableDef} = require('../models/city.model')
const {trimObjectValues, booleanToNumber} = require('../utils/tools')
const crud = require('./common/crud')

/*********************************************************
GET / READ / SELECT
*********************************************************/

const readCities = (req, res) => {
    const query = trimObjectValues(req.query)

    // Clause WHERE : Filtres (conditions)
    const arrParams = []
    if(query.key) arrParams.push({column: 'id', op: 'IN', value: `${query.key}`})
    if(query.ville) arrParams.push({column: 'name', op: 'LIKE', value: `${query.ville}`, pattern: '%?%'})
    if(query.active) arrParams.push({column: 'is_active', op: '=', value: booleanToNumber(query.active)})

    // Clause ORDER BY
    let direction = query.dir || ''
    direction = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
    const sort = {column: cityTableDef.alias[query.sort] || 'name', direction: direction}

    const params = {
        columns: 'id, name',
        queryStringParams: arrParams,
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
        pathParam: {column: 'id', op: '=', value: req.params.id.trim()},
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
        pathParam: {column: 'id', op: '=', value: req.params.id.trim()},
        libelles: {
            method: 'deleteCityById',
            fail: 'Aucune ville n\'a été supprimée',
            success: 'La ville a bien été supprimée',
        }
    }

    crud.deleteRecordById(cityTableDef, params)(req, res)
}

module.exports = {readCities, readCityById, deleteCityById}