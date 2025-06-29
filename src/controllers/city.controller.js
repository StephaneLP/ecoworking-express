const {cityTableDef} = require('../models/city.model')
const crud = require('./common/crud')

/*********************************************************
GET / READ / SELECT
*********************************************************/

const readCities = (req, res) => {
    const arrParams = []

    // FILTRE : Conditions de la clause WHERE
    if(req.query.ville) arrParams.push({column: 'name', op: 'LIKE', value: `%${req.query.ville.trim()}%`})
    if(req.query.active) arrParams.push({column: 'is_active', op: '=', value: req.query.active.trim()})

    // Clause ORDER BY
    const sort = {column: cityTableDef.alias[req.query.sort] || 'name', direction: req.query.dir || 'ASC'}

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
        pathParameter: {name: 'id', op: '=', value: req.params.id.trim()},
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
        pathParameter: {name: 'id', op: '=', value: req.params.id.trim()},
        libelles: {
            method: 'deleteCityById',
            fail: 'Aucune ville n\'a été supprimée',
            success: 'La ville a bien été supprimée',
        }
    }

    crud.deleteRecordById(cityTableDef, params)(req, res)
}

module.exports = {readCities, readCityById, deleteCityById}