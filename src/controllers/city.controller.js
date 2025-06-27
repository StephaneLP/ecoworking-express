const cityModel = require('../models/city.model')
const {readRecords, readRecordById, deleteRecord} = require('./common/crud')

/*********************************************************
GET / READ / SELECT
*********************************************************/

const readCities = (req, res) => {
    const params = {
        columns: 'id, name',
        order: 'name ASC',
        queryString: req.query,
        libelles: {
            method: 'readCities',
            fail: 'Aucune ville n\'a été trouvée',
        }
    }

    readRecords('all', cityModel, params)(req, res)
}

const readCityById = (req, res) => {
    const params = {
        columns: 'id, name, is_active, created_at, updated_at',
        pathParameter: {name: 'id', op: '=', value: req.params.id.trim()},
        libelles: {
            method: 'readCityById',
            fail: 'Aucune ville n\'a été trouvée',
        }
    }

    readRecords('byId', cityModel, params)(req, res)
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

    deleteRecord(cityModel, params)(req, res)
}

module.exports = {readCities, readCityById, deleteCityById}