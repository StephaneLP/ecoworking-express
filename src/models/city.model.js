const db = require('../config/db.js')
const {isInteger} = require('../utils/tools')

const tableName = 'city'
const tableColumns = {
    id: {
        type: 'integer',
        nullAuthorized: false,
        autoIncrement: true
    },
    name: {
        type: 'string',
        lenght: 100,
        nullAuthorized: false
    }
}

const checkFilters = (arrFilters) => {
    let constraints, dataType

    try {
        for (let filter of arrFilters) {
            constraints = tableColumns[filter.name]
            dataType = constraints.type
            switch (dataType) {
                case 'integer':
                    if (!isInteger(filter.value)) return {success: false, code: 400, err: `Type de données incorrect (colonne: ${filter.name})`}
                    break
            }
            const isNull = filter.value.trim() === '' || filter.value 
        }
    }
    catch(err) {
        return {success: false, code: 400, error: err}
    }
}

const reqSELECT = async (params) => {
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

    // const reqSql = `SELECT ${reqColumns} FROM ${reqTables}${reqConditions}${reqOrder}`


    const reqSql = "SELECT * FROM city WHERE id = ?"
    reqParams[0] = '4'
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