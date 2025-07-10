const {cityTableDef} = require('../models/city.model')
const {trimStringValues, booleanToNumber} = require('../utils/tools')
const crud = require('./common/crud')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readCities = (req, res) => {
    const queryParams = trimStringValues(req.query)

    // try {
    //     console.log('--------------------------------------------------------------')
    //     console.log("1", new Date('1998-01-01 00:30:00')) 
    //     console.log("2", (new Date('1998-01-01 00:30:00')).getFullYear())
    //     const date = new Date('1998-01-01T00:30:00.000+0100')
    //     console.log("3", date,  date.getUTCFullYear())
    //     let d1 = new Date("December 17, 1995 03:24:00");
    //     console.log( d1 )
    //     console.log('--------------------------------------------------------------')
    // }
    // catch(err) {
    //     console.log(err)
    // }
    

    // Clause WHERE : tableau contenant les filtres (objets)
    const arrQueryParams = []
    if(queryParams.id) arrQueryParams.push({column: 'id', op: 'IN', values: queryParams.id.split(',')})
    if(queryParams.name) arrQueryParams.push({column: 'name', op: 'LIKE', values: [queryParams.name], pattern: '%?%'})
    if(queryParams.is_active) arrQueryParams.push({column: 'is_active', op: '=', values: [queryParams.is_active]})

    const params = {
        columns: 'id, name, is_active, created_at, DATE_FORMAT(created_at, \'%Y-%m-%d %H:%i:%s\') AS created_at_lib',
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