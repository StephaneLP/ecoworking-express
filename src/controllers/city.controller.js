const {cityTableDef} = require('../models/city.model')
const {trimStringValues, booleanToNumber} = require('../utils/tools')
const crud = require('./common/crud')

/*********************************************************
READ / GET / SELECT
*********************************************************/

const readCities = (req, res) => {
    const queryParams = trimStringValues(req.query)

    try {
        console.log('--------------------------------------------------------------')

        console.log("new DATE('5256984658587') : ", new Date('5256984658587'))
        console.log("Date.parse('5256984658587') : ", Date.parse('5256984658587'))
        console.log('')
        console.log("new DATE('2025-06-30 10:40:55') : ", new Date('2025-06-30 10:40:55'))
        console.log("Date.parse('2025-06-30 10:40:55') : ", Date.parse('2025-06-30 10:40:55'))
        console.log('')
        console.log("new DATE('2025-16-30 10:40:55') : ", new Date('2025-16-30 10:40:55'))
        console.log("Date.parse('2025-16-30 10:40:55') : ", Date.parse('2025-16-30 10:40:55'))
        console.log('')  
        console.log("new DATE('2025-06-30T08:40:55.000Z') : ", new Date('2025-06-30T08:40:55.000Z'))
        console.log("Date.parse('2025-06-30T08:40:55.000Z') : ", Date.parse('2025-06-30T08:40:55.000Z'))
        console.log('')          
        console.log("new DATE('1') : ", new Date('1'))
        console.log("Date.parse('1') : ", Date.parse('1'))
        console.log('')  
        console.log("new DATE('1667206800000') : ", new Date('1667206800000'))
        console.log("Date.parse('1667206800000') : ", Date.parse('1667206800000'))
        console.log('--------------------------------------------------------------')
    }
    catch(err) {
        console.log(err)
    }
    

    // Clause WHERE : tableau contenant les filtres (objets)
    const arrQueryParams = []
    if(queryParams.id) arrQueryParams.push({column: 'id', op: 'IN', values: queryParams.id.split(',')})
    if(queryParams.name) arrQueryParams.push({column: 'name', op: 'LIKE', values: [queryParams.name], pattern: '%?%'})
    if(queryParams.is_active) arrQueryParams.push({column: 'is_active', op: '=', values: [queryParams.is_active]})

    const params = {
        columns: 'id, name, is_active, DATE_FORMAT(created_at, \'%d %M %Y\') AS created_at',
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