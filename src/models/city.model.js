const db = require('../config/db.js')
const {checkFilter} = require('./utils/models.tools')

const tableName = 'city'
const tableColumns = {
    id: {
        type: 'integer',
        nullAuthorized: false,
        autoIncrement: true,
    },
    name: {
        type: 'string',
        lenght: 100,
        emptyAuthorized: false,
        nullAuthorized: false,
    },
    is_active: {
        type: 'boolean',
        nullAuthorized: false,
    }
}

const reqSELECT = async (params) => {
    const filter = params.filter


    let reqConditions = ''
    const reqParams = []

    try {
        if (filter) {
            let columnConstraints, dataType

            for (let condition of filter) {
                columnConstraints = tableColumns[condition.name]
                // if (!columnConstraints) return {success: false, code: 400, error: `Filtre absent du modèle (clé : ${filter.name})`}
                dataType = columnConstraints.type
            }

            reqConditions = ` WHERE ${filter[0].name} ${filter[0].op} ?`
            reqParams.push(filter[0].value)
        }        
    }
    catch(err) {
        return {success: false, code: 500, error: err}
    }



    const reqColumns = params.columns || '*'
    const reqTables = params.tables || tableName
    const reqOrder = params.order ? ` ORDER BY ${params.order}` : ''

    const reqSql = `SELECT ${reqColumns} FROM ${reqTables}${reqConditions}${reqOrder}`
console.log('REQUÊTE : ', reqSql, ' PARAMETRES : ', reqParams)
    let conn
    try {
        conn = await db.getConnection()
        const rows = await conn.query(reqSql, reqParams)
        return {success: true, rows: rows}
    } 
    catch (err) {
        return {success: false, code: 500, error: err}
    } 
    finally {
        if (conn) conn.end()
    }
}



















const reqINSERT = async (params) => {
    let reqConditions = ''
    const reqParams = []
    const filters = params.filters

    try {
        if (filters) {
            let columnConstraints, dataType
            for (let filter of filters) {
                columnConstraints = tableColumns[filter.name]
                // if (!columnConstraints) return {success: false, code: 400, error: `Filtre absent du modèle (clé : ${filter.name})`}
                dataType = columnConstraints.type
                console.log(columnConstraints, dataType)
            }

            reqConditions = ` WHERE ${filters[0].name} ${filters[0].op} ?`
            reqParams.push(filters[0].value)
        }        
    }
    catch(err) {
        return {success: false, code: 500, error: err}
    }

    const reqColumns = params.columns || '*'
    const reqTables = params.tables || tableName
    const reqOrder = params.order ? ` ORDER BY ${params.order}` : ''

    const reqSql = `SELECT ${reqColumns} FROM ${reqTables}${reqConditions}${reqOrder}`

    let conn
    try {
        conn = await db.getConnection()
        const rows = await conn.query(reqSql, reqParams)
        return {success: true, rows: rows}
    } 
    catch (err) {
        return {success: false, code: 500, error: err}
    } 
    finally {
        if (conn) conn.end()
    }
}

module.exports = { reqSELECT, reqINSERT }