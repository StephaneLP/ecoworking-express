const cityModel = require('../models/city.model')
const {select} = require('./utils/crud')

/*********************************************************
GET / READ / SELECT
*********************************************************/

const selectAllCities = (req, res) => {
    const params = {
        columns: 'id, name',
        order: 'name ASC',
        queryString: req.query,
        libelles: {
            method: 'selectAllCities',
            noResult: 'Aucune ville n\'a été trouvée',
        }
    }

    select(cityModel, params)(req, res)
}

const selectCityById = async (req, res) => {
    const params = {
        columns: 'id, name, is_active, created_at, updated_at',
        pathParameter: {name: 'id', op: '=', value: req.params.id.trim()},
        libelles: {
            method: 'selectCityById',
            noResult: 'Aucune ville n\'a été trouvée',
        }
    }

    select(cityModel, params)(req, res)
}

module.exports = {selectAllCities, selectCityById}